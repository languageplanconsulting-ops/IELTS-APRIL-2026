export type ListeningBuilderExamTask = {
  id: string
  questionNumber: number
  questionText: string
  questionWordPhrase: string
  targetText: string
  /** MCQ letter (A–D). Inferred from questionWordPhrase when omitted. */
  correctAnswer?: string
  thaiMeaning: string
  explanationThai: string
}

export type ListeningBuilderExamTest = {
  id: string
  testNumber: number
  title: string
  scriptParagraphs: string[]
  tasks: ListeningBuilderExamTask[]
}

export type ListeningBuilderExamSet = {
  id: string
  bookNumber: number
  sectionNumber: number
  title: string
  tests: ListeningBuilderExamTest[]
}

export const CAMBRIDGE_18_SECTION_2_EXAM_SET: ListeningBuilderExamSet = {
  id: 'cambridge-18-section-2',
  bookNumber: 18,
  sectionNumber: 2,
  title: 'Cambridge 18 · Section 2',
  tests: [
    {
      id: 'cam18-sec2-test1',
      testNumber: 1,
      title: 'Becoming a volunteer for ACE',
      scriptParagraphs: [
        'Good evening, everyone. Let me start by welcoming you all to this talk and thanking you for taking the time to consider joining ACE voluntary organisation. ACE offers support to people and services in the local area and we’re now looking for more volunteers to help us do this.',
        'By the way, I hope you’re all comfortable – we have brought in extra seats so that no one has to stand, but it does mean that the people at the back of the room may be a bit squashed. We’ll only be here for about half an hour so, hopefully, that’s OK.',
        'One of the first questions we’re often asked is how old you need to be to volunteer. Well, you can be as young as 16 or you can be 60 or over; it all depends on what type of voluntary work you want to do. Other considerations, such as reliability, are crucial in voluntary work and age isn’t related to these, in our experience.',
        'Another question we get asked relates to training. Well, there’s plenty of that and it’s all face-to-face. What’s more, training doesn’t end when you start working for us – it takes place before, during and after periods of work. Often, it’s run by other experienced volunteers as managers tend to prefer to get on with other things.',
        'Now, I would ask you to consider a couple of important issues before you decide to apply for voluntary work. We don’t worry about why you want to be a volunteer – people have many different reasons that range from getting work experience to just doing something they’ve always wanted to do. But it is critical that you have enough hours in the day for whatever role we agree is suitable for you – if being a volunteer becomes stressful then it’s best not to do it at all.',
        'You may think that your income is important, but we don’t ask about that. It’s up to you to decide if you can work without earning money. What we value is dedication. Some of our most loyal volunteers earn very little themselves but still give their full energy to the work they do with us.',
        'OK, so let’s take a look at some of the work areas that we need volunteers for and the sort of things that would help you in those.',
        'You may wish simply to help us raise money. If you have the creativity to come up with an imaginative or novel way of fundraising, we’d be delighted, as standing in the local streets or shops with a collection box can be rather boring!',
        'One outdoor activity that we need volunteers for is litter collection and for this it’s useful if you can walk for long periods, sometimes uphill. Some of our regular collectors are quite elderly, but very active and keen to protect the environment.',
        'If you enjoy working with children, we have three vacancies for what are called “playmates”. These volunteers help children learn about staying healthy through a range of out-of-school activities. You don’t need to have children yourself, but it’s good if you know something about nutrition and can give clear instructions.',
        'If that doesn’t appeal to you, maybe you would be interested in helping out at our story club for disabled children, especially if you have done some acting. We put on three performances a year based on books they have read and we’re always looking for support with the theatrical side of this.',
        'The last area I’ll mention today is first aid. Volunteers who join this group can end up teaching others in vulnerable groups who may be at risk of injury. Initially, though, your priority will be to take in a lot of information and not forget any important steps or details.'
      ],
      tasks: [
        {
          id: 'cam18-s2-t1-q11',
          questionNumber: 11,
          questionText: 'Why does the speaker apologise about the seats?\nA) They are too small.\nB) There are not enough of them.\nC) Some of them are very close together.',
          questionWordPhrase: 'very close together',
          targetText: 'a bit squashed',
          thaiMeaning: 'เบียดกัน / อยู่ชิดกันมาก',
          explanationThai: 'ตัวเลือกพูดว่า seats are very close together แต่ใน audio ใช้คำว่า a bit squashed'
        },
        {
          id: 'cam18-s2-t1-q12',
          questionNumber: 12,
          questionText: 'What does the speaker say about the age of volunteers?\nA) The age of volunteers is less important than other factors.\nB) Young volunteers are less reliable than older ones.\nC) Most volunteers are about 60 years old.',
          questionWordPhrase: 'less important than other factors',
          targetText: 'Other considerations, such as reliability, are crucial',
          thaiMeaning: 'สำคัญน้อยกว่าปัจจัยอื่น',
          explanationThai: 'โจทย์สรุปว่า age is less important, ส่วน audio บอกว่า reliability และปัจจัยอื่น crucial กว่า'
        },
        {
          id: 'cam18-s2-t1-q13',
          questionNumber: 13,
          questionText: 'What does the speaker say about training?\nA) It is continuous.\nB) It is conducted by a manager.\nC) It takes place online.',
          questionWordPhrase: 'continuous',
          targetText: 'before, during and after periods of work',
          thaiMeaning: 'ต่อเนื่อง',
          explanationThai: 'continuous ถูกอธิบายด้วย before, during and after periods of work'
        },
        {
          id: 'cam18-s2-t1-q14',
          questionNumber: 14,
          questionText: 'Which issue should applicants consider before volunteering?\nA) their financial situation\nB) their level of commitment\nC) their work experience\nD) their ambition\nE) their availability',
          questionWordPhrase: 'their level of commitment',
          targetText: 'dedication',
          thaiMeaning: 'ระดับความทุ่มเท',
          explanationThai: 'commitment ในโจทย์ถูกพูดใน audio ว่า dedication'
        },
        {
          id: 'cam18-s2-t1-q15',
          questionNumber: 15,
          questionText: 'Which issue should applicants consider before volunteering?\nA) their financial situation\nB) their level of commitment\nC) their work experience\nD) their ambition\nE) their availability',
          questionWordPhrase: 'their availability',
          targetText: 'enough hours in the day',
          thaiMeaning: 'เวลาว่าง / ความพร้อมด้านเวลา',
          explanationThai: 'availability ถูกขยายความใน audio ว่าคุณมี enough hours in the day หรือไม่'
        },
        {
          id: 'cam18-s2-t1-q16',
          questionNumber: 16,
          questionText: 'Area of voluntary work: Fundraising.\nWhat would be helpful?\nA) experience on stage\nB) original, new ideas\nC) parenting skills\nD) an understanding of food and diet\nE) retail experience\nF) a good memory\nG) a good level of fitness',
          questionWordPhrase: 'original, new ideas',
          targetText: 'an imaginative or novel way of fundraising',
          thaiMeaning: 'ไอเดียใหม่ ๆ',
          explanationThai: 'original, new ideas ตรงกับ imaginative or novel way of fundraising'
        },
        {
          id: 'cam18-s2-t1-q17',
          questionNumber: 17,
          questionText: 'Area of voluntary work: Litter collection.\nWhat would be helpful?\nA) experience on stage\nB) original, new ideas\nC) parenting skills\nD) an understanding of food and diet\nE) retail experience\nF) a good memory\nG) a good level of fitness',
          questionWordPhrase: 'a good level of fitness',
          targetText: 'walk for long periods',
          thaiMeaning: 'ร่างกายแข็งแรง',
          explanationThai: 'fitness ไม่พูดตรง ๆ แต่ถูกบอกผ่านการเดินได้นานและบางครั้งขึ้นเนิน'
        },
        {
          id: 'cam18-s2-t1-q18',
          questionNumber: 18,
          questionText: 'Area of voluntary work: Playmates.\nWhat would be helpful?\nA) experience on stage\nB) original, new ideas\nC) parenting skills\nD) an understanding of food and diet\nE) retail experience\nF) a good memory\nG) a good level of fitness',
          questionWordPhrase: 'an understanding of food and diet',
          targetText: 'know something about nutrition',
          thaiMeaning: 'เข้าใจเรื่องอาหารและโภชนาการ',
          explanationThai: 'food and diet ถูก paraphrase เป็น nutrition'
        },
        {
          id: 'cam18-s2-t1-q19',
          questionNumber: 19,
          questionText: 'Area of voluntary work: Story club.\nWhat would be helpful?\nA) experience on stage\nB) original, new ideas\nC) parenting skills\nD) an understanding of food and diet\nE) retail experience\nF) a good memory\nG) a good level of fitness',
          questionWordPhrase: 'experience on stage',
          targetText: 'done some acting',
          thaiMeaning: 'มีประสบการณ์การแสดงบนเวที',
          explanationThai: 'experience on stage ถูกพูดใน audio แบบง่าย ๆ ว่า done some acting'
        },
        {
          id: 'cam18-s2-t1-q20',
          questionNumber: 20,
          questionText: 'Area of voluntary work: First aid.\nWhat would be helpful?\nA) experience on stage\nB) original, new ideas\nC) parenting skills\nD) an understanding of food and diet\nE) retail experience\nF) a good memory\nG) a good level of fitness',
          questionWordPhrase: 'a good memory',
          targetText: 'not forget any important steps or details',
          thaiMeaning: 'ความจำดี',
          explanationThai: 'a good memory ถูกอธิบายผ่าน not forget any important steps or details'
        }
      ]
    },
    {
      id: 'cam18-sec2-test2',
      testNumber: 2,
      title: 'Housing development',
      scriptParagraphs: [
        'Hello everyone. It’s good to see that so many members of the public have shown up for our presentation on the new housing development planned on the outskirts of Nunston. I’m Mark Reynolds and I’m Communications Manager at the development.',
        'I’ll start by giving you a brief overview of our plans for the development. So one thing I’m sure you’ll want to know is why we’ve selected this particular site for a housing development. At present it’s being used for farming, like much of the land around Nunston. But because of the new industrial centre in Nunston, there’s a lot of demand for housing for employees in the region, as many employees are having to commute long distances at present.',
        'Of course, there’s also the fact that we have an international airport just 20 minutes’ drive away, but although that’s certainly convenient, it wasn’t one of our major criteria for choosing the site. We were more interested in the fact that there’s an excellent hospital just 15 kilometres away, and a large secondary school even closer than that. One drawback to the site is that it’s on quite a steep slope, but we’ve taken account of that in our planning so it shouldn’t be a major problem.',
        'We’ve had a lot of positive feedback about the plans. People like the wide variety of accommodation types and prices, and the fact that it’s only a short drive to get out into the countryside from the development.',
        'We were particularly pleased that so many people liked the designs for the layout of the development, with the majority of people saying it generally made a good impression and blended in well with the natural features of the landscape, with provision made for protecting trees and wildlife on the site.',
        'Some people have mentioned that they’d like to see more facilities for cyclists, and we’ll look at that, but the overall feedback has been that the design and facilities of the development make it seem a place where people of all ages can live together happily.',
        'So I’ll put a map of the proposed development up on the screen. You’ll see it’s bounded on the south side by the main road, which then goes on to Nunston. Another boundary is formed by London Road, on the western side of the development. Inside the development there’ll be about 400 houses and 3 apartment blocks.',
        'There’ll also be a school for children up to 11 years old. If you look at the South Entrance at the bottom of the map, there’s a road from there that goes right up through the development. The school will be on that road, at the corner of the second turning to the left.',
        'A large sports centre is planned with facilities for indoor and outdoor activities. This will be on the western side of the development, just below the road that branches off from London Road.',
        'There’ll be a clinic where residents can go if they have any health problems. Can you see the lake towards the top of the map? The clinic will be just below this, to the right of a street of houses.',
        'There’ll also be a community centre for people of all ages. On the northeast side of the development, there’ll be a row of specially designed houses specifically for residents over 65, and the community centre will be adjoining this.',
        'We haven’t forgotten about shopping. There’ll be a supermarket between the two entrances to the development. We’re planning to leave the three large trees near London Road, and it’ll be just to the south of these.',
        'It’s planned to have a playground for younger children. If you look at the road that goes up from the South Entrance, you’ll see it curves round to the left at the top, and the playground will be in that curve, with nice views of the lake.'
      ],
      tasks: [
        {
          id: 'cam18-s2-t2-q11',
          questionNumber: 11,
          questionText: 'What is one main reason this site has been chosen for the housing development?\nA) It has suitable geographical features.\nB) There is easy access to local facilities.\nC) It has good connections with the airport.\nD) The land is of little agricultural value.\nE) It will be convenient for workers.',
          questionWordPhrase: 'easy access to local facilities',
          targetText: 'an excellent hospital just 15 kilometres away, and a large secondary school even closer',
          thaiMeaning: 'เข้าถึงสิ่งอำนวยความสะดวกในท้องถิ่นได้ง่าย',
          explanationThai: 'local facilities ในโจทย์ถูกอธิบายด้วย hospital และ secondary school ที่อยู่ใกล้'
        },
        {
          id: 'cam18-s2-t2-q12',
          questionNumber: 12,
          questionText: 'What is one main reason this site has been chosen for the housing development?\nA) It has suitable geographical features.\nB) There is easy access to local facilities.\nC) It has good connections with the airport.\nD) The land is of little agricultural value.\nE) It will be convenient for workers.',
          questionWordPhrase: 'It will be convenient for workers',
          targetText: 'a lot of demand for housing for employees in the region',
          thaiMeaning: 'สะดวกสำหรับคนทำงาน',
          explanationThai: 'convenient for workers ถูกเล่าผ่านความต้องการบ้านสำหรับ employees'
        },
        {
          id: 'cam18-s2-t2-q13',
          questionNumber: 13,
          questionText: 'Which aspect of the planned housing development has received positive feedback?\nA) the facilities for cyclists\nB) the impact on the environment\nC) the encouragement of good relations between residents\nD) the low cost of all the accommodation\nE) the rural location',
          questionWordPhrase: 'the impact on the environment',
          targetText: 'blended in well with the natural features of the landscape',
          thaiMeaning: 'ผลกระทบต่อสิ่งแวดล้อม',
          explanationThai: 'impact on the environment ถูกอธิบายผ่านการกลมกลืนกับ landscape และการปกป้อง trees and wildlife'
        },
        {
          id: 'cam18-s2-t2-q14',
          questionNumber: 14,
          questionText: 'Which aspect of the planned housing development has received positive feedback?\nA) the facilities for cyclists\nB) the impact on the environment\nC) the encouragement of good relations between residents\nD) the low cost of all the accommodation\nE) the rural location',
          questionWordPhrase: 'the encouragement of good relations between residents',
          targetText: 'people of all ages can live together happily',
          thaiMeaning: 'การส่งเสริมความสัมพันธ์ที่ดีระหว่างผู้อยู่อาศัย',
          explanationThai: 'good relations between residents ถูก paraphrase เป็น live together happily'
        },
        {
          id: 'cam18-s2-t2-q15',
          questionNumber: 15,
          questionText: 'Label the map.\n15 School',
          questionWordPhrase: 'School',
          targetText: 'a school for children up to 11 years old',
          thaiMeaning: 'โรงเรียน',
          explanationThai: 'ข้อนี้เป็น direct evidence จาก script'
        },
        {
          id: 'cam18-s2-t2-q16',
          questionNumber: 16,
          questionText: 'Label the map.\n16 Sports centre',
          questionWordPhrase: 'Sports centre',
          targetText: 'A large sports centre is planned',
          thaiMeaning: 'ศูนย์กีฬา',
          explanationThai: 'ใช้วลีเต็มจาก audio ตรง ๆ'
        },
        {
          id: 'cam18-s2-t2-q17',
          questionNumber: 17,
          questionText: 'Label the map.\n17 Clinic',
          questionWordPhrase: 'Clinic',
          targetText: 'There’ll be a clinic',
          thaiMeaning: 'คลินิก',
          explanationThai: 'ใช้คำตรงจาก audio'
        },
        {
          id: 'cam18-s2-t2-q18',
          questionNumber: 18,
          questionText: 'Label the map.\n18 Community centre',
          questionWordPhrase: 'Community centre',
          targetText: 'There’ll also be a community centre',
          thaiMeaning: 'ศูนย์ชุมชน',
          explanationThai: 'ใช้คำตรงจาก audio'
        },
        {
          id: 'cam18-s2-t2-q19',
          questionNumber: 19,
          questionText: 'Label the map.\n19 Supermarket',
          questionWordPhrase: 'Supermarket',
          targetText: 'There’ll be a supermarket',
          thaiMeaning: 'ซูเปอร์มาร์เก็ต',
          explanationThai: 'ใช้คำตรงจาก audio'
        },
        {
          id: 'cam18-s2-t2-q20',
          questionNumber: 20,
          questionText: 'Label the map.\n20 Playground',
          questionWordPhrase: 'Playground',
          targetText: 'It’s planned to have a playground for younger children',
          thaiMeaning: 'สนามเด็กเล่น',
          explanationThai: 'ใช้คำตรงจาก audio'
        }
      ]
    },
    {
      id: 'cam18-sec2-test3',
      testNumber: 3,
      title: 'Mushroom picking',
      scriptParagraphs: [
        'This evening we’re delighted to welcome Dan Beagle, who’s just written a book on looking for and finding food in the wild. He’s going to tell us everything we need to know about picking wild mushrooms.',
        'Thank you very much. Well, I need to start by talking about safety. You really need to know what you’re doing because some mushrooms are extremely poisonous. Having said that, once you know what to look for, it’s really worth doing for the amazing variety of mushrooms available – which you can’t get in the shops.',
        'But of course, you have to be very careful and that’s why I always say you should never consume mushrooms picked by friends or neighbours – always remember that some poisonous mushrooms look very similar to edible ones and it’s easy for people to get confused. The other thing to avoid is mushrooms growing beside busy roads for obvious reasons. But nothing beats the taste of freshly picked mushrooms – don’t forget that the ones in the shops are often several days old and past their best.',
        'There are certain ideas about wild mushrooms that it’s important to be aware of. Don’t listen to people who tell you that it’s only OK to eat mushrooms that are pale or dull – this is completely untrue. Some edible mushrooms are bright red, for example. Personally, I prefer mushrooms cooked but it won’t do you any harm to eat them uncooked in salads – it’s not necessary to peel them.',
        'Another thing you should remember is that you can’t tell if a mushroom is safe to eat by its smell – some of the most deadly mushrooms have no smell and taste quite nice, apparently. Finally, just because deer or squirrels eat a particular mushroom doesn’t mean that you can.',
        'Of course, mushroom picking is associated with the countryside but if you haven’t got a car, your local park can be a great place to start. There are usually a range of habitats where mushrooms grow, such as playing fields and wooded areas. But you need to be there first thing in the morning, as there’s likely be a lot of competition – not just from people but wildlife too. The deer often get the best mushrooms in my local park.',
        'If you’re a complete beginner, I wouldn’t recommend going alone or relying on photos in a book, even the one I’ve written! There are some really good phone apps for identifying mushrooms, but you can’t always rely on getting a good signal in the middle of a wood. If possible, you should go with a group led by an expert – you’ll stay safe and learn a lot that way.',
        'Conservation is a really important consideration and you must follow a few basic rules. You should never pick all the mushrooms in one area – collect only enough for your own needs. Be very careful that you don’t trample on young mushrooms or other plants. And make sure you don’t pick any mushrooms that are endangered and protected by law.',
        'There’s been a decline in some varieties of wild mushrooms in this part of the country. Restaurants are becoming more interested in locally sourced food like wild mushrooms, but the biggest problem is that so many new houses have been built in this area in the last ten years. And more water is being taken from rivers and reservoirs because of this, and mushroom habitats have been destroyed.',
        'Anyway, a word of advice on storing mushrooms. Collect them in a brown paper bag and as soon as you get home, put them in the fridge. They’ll be fine for a couple of days, but it’s best to cook them as soon as possible – after washing them really carefully first, of course.',
        'So everybody knows what a mushroom tastes like, right? Well, you’ll be surprised by the huge variety of wild mushrooms there are. Be adventurous! They’re great in so many dishes – stir fries, risottos, pasta. But just be aware that some people can react badly to certain varieties so it’s a good idea not to eat huge quantities to begin with.'
      ],
      tasks: [
        {
          id: 'cam18-s2-t3-q11',
          questionNumber: 11,
          questionText: 'Which warning does Dan give about picking mushrooms?\nA) Don’t pick more than one variety of mushroom at a time.\nB) Don’t pick mushrooms near busy roads.\nC) Don’t eat mushrooms given to you.\nD) Don’t eat mushrooms while picking them.\nE) Don’t pick old mushrooms.',
          questionWordPhrase: 'Don’t pick mushrooms near busy roads',
          targetText: 'mushrooms growing beside busy roads',
          thaiMeaning: 'อย่าเก็บเห็ดใกล้ถนนใหญ่',
          explanationThai: 'near busy roads ในโจทย์ถูกพูดเป็น growing beside busy roads'
        },
        {
          id: 'cam18-s2-t3-q12',
          questionNumber: 12,
          questionText: 'Which warning does Dan give about picking mushrooms?\nA) Don’t pick more than one variety of mushroom at a time.\nB) Don’t pick mushrooms near busy roads.\nC) Don’t eat mushrooms given to you.\nD) Don’t eat mushrooms while picking them.\nE) Don’t pick old mushrooms.',
          questionWordPhrase: 'Don’t eat mushrooms given to you',
          targetText: 'never consume mushrooms picked by friends or neighbours',
          thaiMeaning: 'อย่ากินเห็ดที่คนอื่นเก็บมาให้',
          explanationThai: 'given to you ถูกขยายเป็น picked by friends or neighbours'
        },
        {
          id: 'cam18-s2-t3-q13',
          questionNumber: 13,
          questionText: 'Which idea about wild mushrooms does Dan say is correct?\nA) Mushrooms should always be peeled before eating.\nB) Mushrooms eaten by animals may be unsafe.\nC) Cooking destroys toxins in mushrooms.\nD) Brightly coloured mushrooms can be edible.\nE) All poisonous mushrooms have a bad smell.',
          questionWordPhrase: 'Mushrooms eaten by animals may be unsafe',
          targetText: 'just because deer or squirrels eat a particular mushroom doesn’t mean that you can',
          thaiMeaning: 'สัตว์กินได้ ไม่ได้แปลว่าคนกินได้',
          explanationThai: 'unsafe for humans ถูกพูดผ่าน deer or squirrels eat it doesn’t mean you can'
        },
        {
          id: 'cam18-s2-t3-q14',
          questionNumber: 14,
          questionText: 'Which idea about wild mushrooms does Dan say is correct?\nA) Mushrooms should always be peeled before eating.\nB) Mushrooms eaten by animals may be unsafe.\nC) Cooking destroys toxins in mushrooms.\nD) Brightly coloured mushrooms can be edible.\nE) All poisonous mushrooms have a bad smell.',
          questionWordPhrase: 'Brightly coloured mushrooms can be edible',
          targetText: 'Some edible mushrooms are bright red',
          thaiMeaning: 'เห็ดสีสดบางชนิดกินได้',
          explanationThai: 'brightly coloured can be edible ถูกอธิบายด้วย bright red และ edible'
        },
        {
          id: 'cam18-s2-t3-q15',
          questionNumber: 15,
          questionText: 'What advice does Dan give about picking mushrooms in parks?\nA) Choose wooded areas.\nB) Don’t disturb wildlife.\nC) Get there early.',
          questionWordPhrase: 'Get there early',
          targetText: 'you need to be there first thing in the morning',
          thaiMeaning: 'ไปให้เช้า',
          explanationThai: 'get there early ในโจทย์ตรงกับ first thing in the morning'
        },
        {
          id: 'cam18-s2-t3-q16',
          questionNumber: 16,
          questionText: 'Dan says it is a good idea for beginners to\nA) use a mushroom app.\nB) join a group.\nC) take a reference book.',
          questionWordPhrase: 'join a group',
          targetText: 'go with a group led by an expert',
          thaiMeaning: 'เข้าร่วมกลุ่ม',
          explanationThai: 'join a group ถูกพูดเต็ม ๆ ว่า go with a group led by an expert'
        },
        {
          id: 'cam18-s2-t3-q17',
          questionNumber: 17,
          questionText: 'What does Dan say is important for conservation?\nA) selecting only fully grown mushrooms\nB) picking a limited amount of mushrooms\nC) avoiding areas where rare mushroom species grow',
          questionWordPhrase: 'picking a limited amount of mushrooms',
          targetText: 'collect only enough for your own needs',
          thaiMeaning: 'เก็บในปริมาณจำกัด',
          explanationThai: 'limited amount ในโจทย์ถูกพูดเป็น only enough for your own needs'
        },
        {
          id: 'cam18-s2-t3-q18',
          questionNumber: 18,
          questionText: 'According to Dan, some varieties of wild mushrooms are in decline because there is\nA) a huge demand for them from restaurants.\nB) a lack of rain in this part of the country.\nC) a rise in building developments locally.',
          questionWordPhrase: 'a rise in building developments locally',
          targetText: 'so many new houses have been built in this area',
          thaiMeaning: 'มีการพัฒนาก่อสร้างในพื้นที่เพิ่มขึ้น',
          explanationThai: 'building developments locally ถูกอธิบายเป็น new houses have been built in this area'
        },
        {
          id: 'cam18-s2-t3-q19',
          questionNumber: 19,
          questionText: 'Dan says that when storing mushrooms, people should\nA) keep them in the fridge for no more than two days.\nB) keep them in a brown bag in a dark room.\nC) leave them for a period after washing them.',
          questionWordPhrase: 'keep them in the fridge for no more than two days',
          targetText: 'They’ll be fine for a couple of days',
          thaiMeaning: 'เก็บในตู้เย็นได้ประมาณสองวัน',
          explanationThai: 'no more than two days ในโจทย์ตรงกับ a couple of days'
        },
        {
          id: 'cam18-s2-t3-q20',
          questionNumber: 20,
          questionText: 'What does Dan say about trying new varieties of mushrooms?\nA) Experiment with different recipes.\nB) Expect some to have a strong taste.\nC) Cook them for a long time.',
          questionWordPhrase: 'Experiment with different recipes',
          targetText: 'They’re great in so many dishes',
          thaiMeaning: 'ลองทำหลายเมนู',
          explanationThai: 'experiment with different recipes ถูกส่งความหมายผ่าน great in so many dishes'
        }
      ]
    },
    {
      id: 'cam18-sec2-test4',
      testNumber: 4,
      title: 'Museum of Farming Life',
      scriptParagraphs: [
        'Good morning everyone, and welcome to the Museum of Farming Life. I understand it’s your first visit here, so I’d like to give you some background information about the museum and then explain a little about what you can see during your visit.',
        'So, where we’re standing at the moment is the entrance to a large building that was constructed in 1880 as the home of a local businessman, Alfred Palmer, of the Palmer biscuit factory. It was later sold and became a hall of residence for students in 1911, and a museum in 1951. In 2005, a modern extension was built to accommodate the museum’s collections.',
        'The museum’s owned by the university, and apart from two rooms that are our offices, the university uses the main part of the building. You may see students going into the building for lessons, but it’s not open to museum visitors, I’m afraid. It’s a shame because the interior architectural features are outstanding, especially the room that used to be the library.',
        'Luckily, we’ve managed to keep entry to the museum free. This includes access to all the galleries, outdoor areas and the rooms for special exhibitions. We run activities for children and students, such as the museum club, for which there’s no charge. We do have a donation box just over there so feel free to give whatever amount you consider appropriate.',
        'We do have a cloakroom, if you’d like to leave your coats and bags somewhere. Unlike other museums, photography is allowed here, so you might like to keep your cameras with you. You might be more comfortable not carrying around heavy rucksacks, though keep your coats and jackets on as it’s quite cold in the museum garden today.',
        'I’d like to tell you about the different areas of the museum.',
        'Just inside, and outside the main gallery, we have an area called Four Seasons. Here you can watch a four-minute animation of a woodland scene. It was designed especially for the museum by a group of young people on a film studies course, and it’s beautiful. Children absolutely love it, but then, so do adults.',
        'The main gallery’s called Town and Country. It includes a photographic collection of prize-winning sheep and shepherds. Leaving Town and Country, you enter Farmhouse Kitchen, which is … well, self-explanatory. Here we have the oldest collection of equipment for making butter and cheese in the country. And this morning, a specialist cheesemaker will be giving demonstrations of how it’s produced. You may even get to try some.',
        'After that, you can go in two directions. To the right is a staircase that takes you up to a landing from where you can look down on the galleries. To the left is a room called A Year on the Farm. There’s lots of seating here as sometimes we use the room for school visits, so it’s a good place to stop for a rest. If you’re feeling competitive, you can take our memory test in which you answer questions about things you’ve seen in the museum.',
        'The next area’s called Wagon Walk. This contains farm carts from nearly every part of the country. It’s surprising how much regional variation there was. Beside the carts are display boards with information about each one. The carts are old and fragile, so we ask you to keep your children close to you and ensure they don’t climb on the carts.',
        'From Wagon Walk, you can either make your way back to reception or go out into the garden – or even go back to take another look in the galleries. In the far corner of the garden is Bees are Magic, but we’re redeveloping this area so you can’t visit that at the moment. You can still buy our honey in the shop, though.',
        'Finally, there’s The Pond, which contains all kinds of interesting wildlife. There are baby ducks that are only a few days old, as well as tiny frogs. The Pond isn’t deep and there’s a fence around it, so it’s perfectly safe for children.'
      ],
      tasks: [
        {
          id: 'cam18-s2-t4-q11',
          questionNumber: 11,
          questionText: 'The museum building was originally\nA) a factory.\nB) a private home.\nC) a hall of residence.',
          questionWordPhrase: 'a private home',
          targetText: 'the home of a local businessman',
          thaiMeaning: 'บ้านส่วนตัว',
          explanationThai: 'private home ถูกอธิบายใน audio ว่า the home of a local businessman'
        },
        {
          id: 'cam18-s2-t4-q12',
          questionNumber: 12,
          questionText: 'The university uses part of the museum building as\nA) teaching rooms.\nB) a research library.\nC) administration offices.',
          questionWordPhrase: 'teaching rooms',
          targetText: 'students going into the building for lessons',
          thaiMeaning: 'ห้องเรียน',
          explanationThai: 'teaching rooms ถูกสื่อผ่าน students going in for lessons'
        },
        {
          id: 'cam18-s2-t4-q13',
          questionNumber: 13,
          questionText: 'What does the guide say about the entrance fee?\nA) Visitors decide whether or not they wish to pay.\nB) Only children and students receive a discount.\nC) The museum charges extra for special exhibitions.',
          questionWordPhrase: 'Visitors decide whether or not they wish to pay',
          targetText: 'feel free to give whatever amount you consider appropriate',
          thaiMeaning: 'จะจ่ายหรือไม่ / จ่ายเท่าไรก็ได้ตามสมัครใจ',
          explanationThai: 'Visitors decide whether or not they wish to pay ถูกอธิบายว่า give whatever amount you consider appropriate'
        },
        {
          id: 'cam18-s2-t4-q14',
          questionNumber: 14,
          questionText: 'What are visitors advised to leave in the cloakroom?\nA) cameras\nB) coats\nC) bags',
          questionWordPhrase: 'bags',
          targetText: 'leave your coats and bags somewhere',
          thaiMeaning: 'กระเป๋า',
          explanationThai: 'แม้พูดถึง coats ด้วย แต่คำแนะนำจริงคือเก็บ bags ไว้ จะได้ไม่ต้องถือของหนัก'
        },
        {
          id: 'cam18-s2-t4-q15',
          questionNumber: 15,
          questionText: 'What information does the speaker give about Four Seasons?\nA) Parents must supervise their children.\nB) There are new things to see.\nC) It is closed today.\nD) This is only for school groups.\nE) There is a quiz for visitors.\nF) It features something created by students.\nG) An expert is here today.\nH) There is a one-way system.',
          questionWordPhrase: 'It features something created by students',
          targetText: 'designed especially for the museum by a group of young people on a film studies course',
          thaiMeaning: 'มีสิ่งที่นักเรียน / นักศึกษาสร้างไว้',
          explanationThai: 'created by students ถูกพูดผ่าน young people on a film studies course'
        },
        {
          id: 'cam18-s2-t4-q16',
          questionNumber: 16,
          questionText: 'What information does the speaker give about Farmhouse Kitchen?\nA) Parents must supervise their children.\nB) There are new things to see.\nC) It is closed today.\nD) This is only for school groups.\nE) There is a quiz for visitors.\nF) It features something created by students.\nG) An expert is here today.\nH) There is a one-way system.',
          questionWordPhrase: 'An expert is here today',
          targetText: 'a specialist cheesemaker will be giving demonstrations',
          thaiMeaning: 'วันนี้มีผู้เชี่ยวชาญมา',
          explanationThai: 'expert ในโจทย์ถูกพูดเฉพาะว่า a specialist cheesemaker'
        },
        {
          id: 'cam18-s2-t4-q17',
          questionNumber: 17,
          questionText: 'What information does the speaker give about A Year on the Farm?\nA) Parents must supervise their children.\nB) There are new things to see.\nC) It is closed today.\nD) This is only for school groups.\nE) There is a quiz for visitors.\nF) It features something created by students.\nG) An expert is here today.\nH) There is a one-way system.',
          questionWordPhrase: 'There is a quiz for visitors',
          targetText: 'take our memory test',
          thaiMeaning: 'มีแบบทดสอบ / quiz สำหรับผู้เยี่ยมชม',
          explanationThai: 'quiz ถูกพูดใน audio เป็น memory test'
        },
        {
          id: 'cam18-s2-t4-q18',
          questionNumber: 18,
          questionText: 'What information does the speaker give about Wagon Walk?\nA) Parents must supervise their children.\nB) There are new things to see.\nC) It is closed today.\nD) This is only for school groups.\nE) There is a quiz for visitors.\nF) It features something created by students.\nG) An expert is here today.\nH) There is a one-way system.',
          questionWordPhrase: 'Parents must supervise their children',
          targetText: 'keep your children close to you',
          thaiMeaning: 'ผู้ปกครองต้องดูแลเด็กอย่างใกล้ชิด',
          explanationThai: 'supervise their children ถูกพูดเป็น keep your children close to you'
        },
        {
          id: 'cam18-s2-t4-q19',
          questionNumber: 19,
          questionText: 'What information does the speaker give about Bees are Magic?\nA) Parents must supervise their children.\nB) There are new things to see.\nC) It is closed today.\nD) This is only for school groups.\nE) There is a quiz for visitors.\nF) It features something created by students.\nG) An expert is here today.\nH) There is a one-way system.',
          questionWordPhrase: 'It is closed today',
          targetText: 'you can’t visit that at the moment',
          thaiMeaning: 'วันนี้ปิด / ตอนนี้เข้าไม่ได้',
          explanationThai: 'closed today ถูกพูดเป็น can’t visit that at the moment'
        },
        {
          id: 'cam18-s2-t4-q20',
          questionNumber: 20,
          questionText: 'What information does the speaker give about The Pond?\nA) Parents must supervise their children.\nB) There are new things to see.\nC) It is closed today.\nD) This is only for school groups.\nE) There is a quiz for visitors.\nF) It features something created by students.\nG) An expert is here today.\nH) There is a one-way system.',
          questionWordPhrase: 'There are new things to see',
          targetText: 'baby ducks that are only a few days old',
          thaiMeaning: 'มีอะไรใหม่ ๆ ให้ดู',
          explanationThai: 'new things to see ถูกสื่อด้วย baby ducks ที่เพิ่งเกิด'
        }
      ]
    }
  ]
}
