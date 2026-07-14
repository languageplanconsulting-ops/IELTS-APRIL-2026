// Model essays for IELTS Writing Task 2, organised by question type. Each essay follows the
// user's own dictated sentence-by-sentence pattern for that type EXACTLY (see memory:
// writing-task2-essay-patterns). 260-300 words, B2 vocabulary, grammar ceiling of one
// subordinating-conjunction / non-defining-which / gerund-participle device per sentence.

export type WritingTask2TypeId =
  | 'to-what-extent'
  | 'double-question'
  | 'discuss-both-views'
  | 'advantages-disadvantages'

export type WritingTask2Role = 'intro' | 'body1' | 'body2' | 'body3' | 'conclusion'

export type WritingTask2Paragraph = {
  role: WritingTask2Role
  text: string
}

export type WritingTask2VocabItem = {
  word: string
  thaiMeaning: string
}

export type WritingTask2Prompt = {
  id: string
  number: number
  typeId: WritingTask2TypeId
  title: string
  questionText: string
  meta: string
  paragraphs: WritingTask2Paragraph[]
  vocab: WritingTask2VocabItem[]
}

export const WRITING_TASK2_PROMPTS: WritingTask2Prompt[] = [
  // ── To What Extent ──────────────────────────────────────────────────
  {
    id: 't2-twe-1',
    number: 1,
    typeId: 'to-what-extent',
    title: 'Preserving Old Buildings',
    questionText:
      'Some people think old buildings should be preserved, while others believe they should be pulled down to make way for modern developments. To what extent do you agree or disagree?',
    meta: 'India · Jun 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while some old constructions may appear outdated, maintaining them is essential for preserving a country's history and cultural identity. Others argue that pulling down these structures and replacing them with modern buildings would better meet the practical needs of a growing population. I personally believe that historic buildings should be preserved, and my reasons will be elaborated on in the following paragraphs."
      },
      {
        role: 'body1',
        text: "To begin with, it might seem sensible for some to claim that old buildings should be pulled down to make way for modern infrastructure. To explain it simply, this is possibly because older structures often fail to meet current safety and space requirements; therefore, replacing them allows cities to meet the needs of a growing population more efficiently. For example, many rapidly developing cities have pulled down old buildings to construct high-rise apartments and offices. From this perspective, it is understandable why some would believe that modern buildings serve society's needs more effectively than old ones."
      },
      {
        role: 'body2',
        text: "However, I would personally argue in favor of the idea that old buildings should be carefully preserved. To put it simply, this is due to the fact that these structures represent a nation's history and cultural heritage, which cannot be recreated once destroyed. For instance, cities such as Rome and Kyoto attract millions of tourists every year largely because of their well-preserved historic buildings. In this respect, it is evident that maintaining old buildings brings both cultural and economic value to a country."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that building modern structures can help cities meet growing practical needs, I am of the opinion that preserving old buildings is more important, as they protect a nation's history for future generations."
      }
    ],
    vocab: [
      { word: 'cultural identity', thaiMeaning: 'อัตลักษณ์ทางวัฒนธรรม' },
      { word: 'cultural heritage', thaiMeaning: 'มรดกทางวัฒนธรรม' },
      { word: 'safety requirements', thaiMeaning: 'ข้อกำหนดด้านความปลอดภัย' },
      { word: 'economic value', thaiMeaning: 'คุณค่าทางเศรษฐกิจ' }
    ]
  },
  {
    id: 't2-twe-2',
    number: 2,
    typeId: 'to-what-extent',
    title: 'The Value of Studying History',
    questionText:
      'Some people think that studying history is a waste of time, while others believe that learning about the past helps us understand the present. To what extent do you agree or disagree?',
    meta: 'India · Jan 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while the past cannot be changed, understanding it has little practical relevance to people living in the present. Others argue that studying history remains essential for understanding and improving present-day society. I personally believe that learning about the past is highly valuable, and my reasons will be elaborated on in the following paragraphs."
      },
      {
        role: 'body1',
        text: "To begin with, it might seem sensible for some to claim that studying history serves little practical purpose in modern life. To explain it simply, this is possibly because historical events cannot be altered and have no direct bearing on today's technology or economy; therefore, some believe time would be better spent learning practical skills instead. For example, many students today choose to study coding or business rather than history, believing these subjects offer more immediate career benefits. From this perspective, it is understandable why some would believe that focusing on the present is more useful than studying the past."
      },
      {
        role: 'body2',
        text: "However, I would personally argue in favor of the idea that learning about the past is essential. To put it simply, this is due to the fact that history allows societies to understand the causes of present problems and avoid repeating past mistakes, which can be extremely costly. For instance, many countries continue to study the causes of the 2008 financial crisis in order to prevent similar economic collapses in the future. In this respect, it is evident that studying history provides valuable lessons that directly benefit the present."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that historical events themselves cannot be changed, I am of the opinion that learning about the past is highly valuable, as it helps societies avoid repeating the same mistakes."
      }
    ],
    vocab: [
      { word: 'financial crisis', thaiMeaning: 'วิกฤตการเงิน' },
      { word: 'economic collapse', thaiMeaning: 'การล่มสลายทางเศรษฐกิจ' },
      { word: 'career benefits', thaiMeaning: 'ผลประโยชน์ด้านอาชีพ' },
      { word: 'historical events', thaiMeaning: 'เหตุการณ์ทางประวัติศาสตร์' }
    ]
  },
  {
    id: 't2-twe-3',
    number: 3,
    typeId: 'to-what-extent',
    title: 'Government vs. Private Science Funding',
    questionText:
      'Some people believe that scientific research should be funded and controlled by the government, while others think private companies should be responsible for it. To what extent do you agree or disagree?',
    meta: 'Spain · Jun 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while private companies can drive rapid technological innovation, scientific research should ultimately remain under government control. Others argue that private companies are better positioned to fund and accelerate scientific progress. I personally believe that governments should retain primary control over scientific research, and my reasons will be elaborated on in the following paragraphs."
      },
      {
        role: 'body1',
        text: "To begin with, it might seem sensible for some to claim that private companies are better suited to lead scientific research. To explain it simply, this is possibly because private firms often have greater funding and stronger commercial incentives to innovate quickly; therefore, breakthroughs can reach the public faster than through government-led projects. For example, private pharmaceutical companies developed COVID-19 vaccines within less than a year of the pandemic beginning. From this perspective, it is understandable why some would believe that private companies drive scientific progress more effectively than governments."
      },
      {
        role: 'body2',
        text: "However, I would personally argue in favor of the idea that governments should retain control over scientific research. To put it simply, this is due to the fact that government funding ensures research prioritizes public benefit rather than profit, which private companies cannot always guarantee. For instance, publicly funded institutions such as NASA have made major scientific discoveries that were shared freely with the world instead of being sold for profit. In this respect, it is evident that government-controlled research better serves the interests of society as a whole."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that private companies can accelerate certain scientific breakthroughs, I am of the opinion that governments should remain in control of scientific research, as this best protects the public interest."
      }
    ],
    vocab: [
      { word: 'commercial incentives', thaiMeaning: 'แรงจูงใจเชิงพาณิชย์' },
      { word: 'public benefit', thaiMeaning: 'ประโยชน์สาธารณะ' },
      { word: 'scientific breakthroughs', thaiMeaning: 'ความก้าวหน้าทางวิทยาศาสตร์ครั้งสำคัญ' },
      { word: 'public interest', thaiMeaning: 'ผลประโยชน์สาธารณะ' }
    ]
  },
  {
    id: 't2-twe-4',
    number: 4,
    typeId: 'to-what-extent',
    title: 'Should Universities Teach Arts Subjects?',
    questionText:
      'Some people believe universities should stop offering arts subjects such as philosophy and history, and focus only on courses that prepare students for employment. To what extent do you agree or disagree?',
    meta: 'France · Jun 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while rising tuition fees make practical courses more appealing, universities should stop teaching arts subjects such as philosophy and history in favor of purely practical courses. Others argue that focusing solely on employment-focused courses would better prepare graduates for the job market. I personally believe that universities should continue offering arts subjects, and my reasons will be elaborated on in the following paragraphs."
      },
      {
        role: 'body1',
        text: "To begin with, it might seem sensible for some to claim that universities should focus only on practical courses. To explain it simply, this is possibly because graduates with technical skills often find employment more quickly after graduation; therefore, replacing arts subjects with practical training could reduce graduate unemployment. For example, engineering and computer science graduates in many countries report considerably higher starting salaries than graduates of arts programs. From this perspective, it is understandable why some would believe that practical courses better prepare students for the job market."
      },
      {
        role: 'body2',
        text: "However, I would personally argue in favor of the idea that universities should continue teaching arts subjects. To put it simply, this is due to the fact that subjects such as philosophy and history develop critical thinking and communication skills, which employers in every industry continue to value. For instance, many successful business leaders, including several well-known technology founders, credit their humanities education with shaping their creative and analytical abilities. In this respect, it is evident that arts subjects provide skills that remain valuable regardless of a graduate's chosen career."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that practical courses can improve graduates' short-term job prospects, I am of the opinion that universities should continue offering arts subjects, as they build skills that benefit graduates throughout their careers."
      }
    ],
    vocab: [
      { word: 'critical thinking', thaiMeaning: 'การคิดวิเคราะห์' },
      { word: 'starting salaries', thaiMeaning: 'เงินเดือนเริ่มต้น' },
      { word: 'humanities education', thaiMeaning: 'การศึกษาด้านมนุษยศาสตร์' },
      { word: 'job prospects', thaiMeaning: 'โอกาสในการทำงาน' }
    ]
  },
  {
    id: 't2-twe-5',
    number: 5,
    typeId: 'to-what-extent',
    title: 'Is Responsible Tourism Possible?',
    questionText:
      'Some people believe it is impossible for tourists to be responsible towards the environment and local culture. To what extent do you agree or disagree?',
    meta: 'Vietnam · Jun 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while tourism inevitably affects the places visited, it is impossible for any tourist to be truly responsible toward both culture and environment. Others argue that with careful planning, tourists can genuinely reduce their negative impact. I personally believe that being a responsible tourist is possible, and my reasons will be elaborated on in the following paragraphs."
      },
      {
        role: 'body1',
        text: "To begin with, it might seem sensible for some to claim that responsible tourism is impossible to achieve. To explain it simply, this is possibly because even eco-friendly travel requires transportation that produces carbon emissions; therefore, every visit inevitably damages the environment to some degree. For example, flights to popular island destinations such as the Maldives contribute significantly to global carbon emissions regardless of a tourist's intentions. From this perspective, it is understandable why some would believe that no tourist can be entirely responsible."
      },
      {
        role: 'body2',
        text: "However, I would personally argue in favor of the idea that responsible tourism is achievable. To put it simply, this is due to the fact that tourists can make deliberate choices, such as supporting local businesses and respecting local customs, which significantly reduce their overall impact. For instance, many visitors to Bhutan follow strict government guidelines designed to protect both the environment and traditional culture. In this respect, it is evident that responsible tourism, while not perfect, is a realistic and achievable goal."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that all tourism carries some environmental cost, I am of the opinion that being a responsible tourist is possible, as thoughtful choices can greatly reduce this impact."
      }
    ],
    vocab: [
      { word: 'carbon emissions', thaiMeaning: 'การปล่อยก๊าซคาร์บอน' },
      { word: 'local customs', thaiMeaning: 'ขนบธรรมเนียมท้องถิ่น' },
      { word: 'government guidelines', thaiMeaning: 'แนวทางของรัฐบาล' },
      { word: 'environmental impact', thaiMeaning: 'ผลกระทบต่อสิ่งแวดล้อม' }
    ]
  },
  {
    id: 't2-twe-6',
    number: 6,
    typeId: 'to-what-extent',
    title: 'Should Extinction Be Prevented?',
    questionText:
      'It is a natural process when animal species become extinct, as dinosaurs died out in the past. There is no reason for people to prevent this from happening. To what extent do you agree or disagree?',
    meta: 'Australia · Jan 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while extinction has occurred naturally throughout Earth's history, humans have no obligation to prevent animal species from dying out today. Others argue that people have a responsibility to protect endangered species from disappearing completely. I personally believe that humans should actively work to prevent extinction, and my reasons will be elaborated on in the following paragraphs."
      },
      {
        role: 'body1',
        text: "To begin with, it might seem sensible for some to claim that extinction is simply a natural process that should not be interfered with. To explain it simply, this is possibly because countless species, including dinosaurs, vanished long before humans existed; therefore, some believe modern extinctions are merely part of the same natural cycle. For example, several land mammal species disappeared during past ice ages without any human involvement whatsoever. From this perspective, it is understandable why some would believe that current extinctions require no special human intervention."
      },
      {
        role: 'body2',
        text: "However, I would personally argue in favor of the idea that humans should take active steps to prevent extinction. To put it simply, this is due to the fact that most extinctions today are caused directly by human activity rather than natural processes, which makes them our responsibility to address. For instance, a 2019 United Nations report found that around one million species now face extinction largely because of habitat destruction and pollution. In this respect, it is evident that human-driven extinction differs fundamentally from the natural extinctions of the distant past."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that extinction has always occurred naturally, I am of the opinion that humans should work to prevent it, as most modern cases result directly from human actions."
      }
    ],
    vocab: [
      { word: 'endangered species', thaiMeaning: 'สัตว์ใกล้สูญพันธุ์' },
      { word: 'natural cycle', thaiMeaning: 'วัฏจักรตามธรรมชาติ' },
      { word: 'habitat destruction', thaiMeaning: 'การทำลายถิ่นที่อยู่อาศัย' },
      { word: 'human activity', thaiMeaning: 'กิจกรรมของมนุษย์' }
    ]
  },
  {
    id: 't2-twe-7',
    number: 7,
    typeId: 'to-what-extent',
    title: 'Preventing Illness vs. Treating the Sick',
    questionText:
      'Some people think it is more important to spend public money on promoting healthy lifestyles to prevent disease than to treat people who are already sick. Do you agree or disagree with this statement?',
    meta: 'UK · Jan 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while treating illness remains necessary, governments should prioritize public spending on promoting healthy lifestyles over treating people who are already sick. Others argue that treatment should remain the top funding priority, since sick people need immediate medical care. I personally believe that prevention deserves greater public investment, and my reasons will be elaborated on in the following paragraphs."
      },
      {
        role: 'body1',
        text: "To begin with, it might seem sensible for some to claim that treating existing illness should remain the government's main priority. To explain it simply, this is possibly because sick patients require urgent medical attention that cannot be delayed; therefore, reducing treatment funding could put vulnerable lives at serious risk. For example, cancer patients and accident victims often need immediate hospital care regardless of how much money is spent on prevention. From this perspective, it is understandable why some would believe that treating the sick should take precedence over prevention campaigns."
      },
      {
        role: 'body2',
        text: "However, I would personally argue in favor of the idea that promoting healthy lifestyles deserves greater public investment. To put it simply, this is due to the fact that preventing illness before it develops reduces long-term healthcare costs, which ultimately benefits the entire population. For instance, a 2020 World Health Organization study found that every dollar spent on obesity-prevention programs saved several dollars in future treatment costs. In this respect, it is evident that prevention spending produces greater long-term benefits for public health systems."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that treating sick patients remains an urgent necessity, I am of the opinion that promoting healthy lifestyles should receive greater public funding, as prevention reduces future healthcare burdens significantly."
      }
    ],
    vocab: [
      { word: 'healthy lifestyles', thaiMeaning: 'วิถีชีวิตที่ดีต่อสุขภาพ' },
      { word: 'medical attention', thaiMeaning: 'การดูแลรักษาทางการแพทย์' },
      { word: 'healthcare costs', thaiMeaning: 'ค่าใช้จ่ายด้านสุขภาพ' },
      { word: 'public health systems', thaiMeaning: 'ระบบสาธารณสุข' }
    ]
  },
  {
    id: 't2-twe-8',
    number: 8,
    typeId: 'to-what-extent',
    title: 'Raising the Minimum Driving Age',
    questionText:
      'Some people believe that the best way to improve road safety is to raise the minimum age for driving cars and motorcycles. To what extent do you agree or disagree?',
    meta: 'Vietnam · Jan 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while young drivers gain independence early, raising the minimum age for driving cars and motorcycles is the best way to improve road safety. Others argue that stricter testing and driver education would be more effective than simply raising the age limit. I personally believe that raising the minimum driving age is the most effective solution, and my reasons will be elaborated on in the following paragraphs."
      },
      {
        role: 'body1',
        text: "To begin with, it might seem sensible for some to claim that better training programs would improve road safety more effectively than age restrictions. To explain it simply, this is possibly because skill and experience matter more than age when operating a vehicle safely; therefore, some believe intensive driving courses could reduce accidents without delaying independence. For example, several countries already require additional lessons for newly licensed drivers before allowing them to drive unsupervised. From this perspective, it is understandable why some would believe that improved training addresses the root cause of dangerous driving."
      },
      {
        role: 'body2',
        text: "However, I would personally argue in favor of the idea that raising the minimum driving age is the most effective measure. To put it simply, this is due to the fact that younger drivers' brains are still developing the judgment needed for quick decision-making, which extra training cannot fully replace. For instance, a 2021 study by the World Health Organization found that drivers aged sixteen to nineteen are nearly three times more likely to crash than drivers over twenty-five. In this respect, it is evident that raising the minimum age directly targets the drivers most at risk of causing accidents."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that better training could reduce some accidents, I am of the opinion that raising the minimum driving age remains the most effective way to improve road safety."
      }
    ],
    vocab: [
      { word: 'road safety', thaiMeaning: 'ความปลอดภัยบนท้องถนน' },
      { word: 'driver education', thaiMeaning: 'การอบรมผู้ขับขี่' },
      { word: 'decision-making', thaiMeaning: 'การตัดสินใจ' },
      { word: 'age restrictions', thaiMeaning: 'ข้อจำกัดด้านอายุ' }
    ]
  },
  {
    id: 't2-twe-9',
    number: 9,
    typeId: 'to-what-extent',
    title: 'Unpaid Community Work for Teenagers',
    questionText:
      'Some people think that teenagers should do some unpaid work in the local community. Some people believe that it benefits both young people and society as a whole. To what extent do you agree or disagree?',
    meta: 'France · Feb 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while schoolwork already demands considerable time, teenagers should be required to do unpaid work in their local community, since this benefits both young people and society as a whole. Others argue that teenagers should focus entirely on their studies instead of taking on additional unpaid responsibilities. I personally believe that community work brings valuable benefits to teenagers, and my reasons will be elaborated on in the following paragraphs."
      },
      {
        role: 'body1',
        text: "To begin with, it might seem sensible for some to claim that teenagers should not be required to do unpaid community work. To explain it simply, this is possibly because academic performance already places enormous pressure on students; therefore, some believe additional responsibilities could harm their exam results. For example, many students already spend several hours each evening completing homework and preparing for important examinations. From this perspective, it is understandable why some would believe that community work would place an unfair burden on busy teenagers."
      },
      {
        role: 'body2',
        text: "However, I would personally argue in favor of the idea that unpaid community work benefits both teenagers and wider society. To put it simply, this is due to the fact that volunteering teaches practical skills and responsibility, which cannot easily be learned through classroom study alone. For instance, a 2022 survey by the National Youth Agency in the UK found that teenagers who volunteered regularly reported significantly higher confidence and stronger communication skills. In this respect, it is evident that community work develops abilities that benefit young people well beyond school."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that academic study remains a priority for teenagers, I am of the opinion that unpaid community work should be encouraged, as it builds valuable life skills alongside classroom learning."
      }
    ],
    vocab: [
      { word: 'academic performance', thaiMeaning: 'ผลการเรียน' },
      { word: 'practical skills', thaiMeaning: 'ทักษะเชิงปฏิบัติ' },
      { word: 'communication skills', thaiMeaning: 'ทักษะการสื่อสาร' },
      { word: 'life skills', thaiMeaning: 'ทักษะชีวิต' }
    ]
  },
  {
    id: 't2-twe-10',
    number: 10,
    typeId: 'to-what-extent',
    title: "The Internet: Humanity's Greatest Invention?",
    questionText:
      'There have been many inventions in human history, such as the wheel. Some people think that the most important invention is the internet. To what extent do you agree or disagree with this opinion?',
    meta: 'Canada · Apr 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while human history includes many transformative inventions such as the wheel, the internet is the single most important invention ever created. Others argue that older inventions laid the essential foundation on which modern technology, including the internet, could later be built. I personally believe that the internet is indeed the most important invention, and my reasons will be elaborated on in the following paragraphs."
      },
      {
        role: 'body1',
        text: "To begin with, it might seem sensible for some to claim that earlier inventions such as the wheel deserve greater recognition than the internet. To explain it simply, this is possibly because the wheel enabled transportation and trade thousands of years before modern technology existed; therefore, some believe it created the foundation for all later human progress. For example, ancient civilizations used wheeled carts to build cities, transport goods, and expand agriculture across vast distances. From this perspective, it is understandable why some would believe that foundational inventions like the wheel matter more than the internet."
      },
      {
        role: 'body2',
        text: "However, I would personally argue in favor of the idea that the internet is the most significant invention in human history. To put it simply, this is due to the fact that it connects billions of people instantly, which has transformed communication, education, and business on an unprecedented global scale. For instance, the International Telecommunication Union reported in 2023 that over five billion people worldwide now use the internet regularly. In this respect, it is evident that no other invention has reshaped daily life as rapidly or as widely as the internet."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that earlier inventions such as the wheel shaped human civilization, I am of the opinion that the internet remains the most important invention, given its unmatched global impact."
      }
    ],
    vocab: [
      { word: 'transportation and trade', thaiMeaning: 'การคมนาคมขนส่งและการค้า' },
      { word: 'human progress', thaiMeaning: 'ความก้าวหน้าของมนุษยชาติ' },
      { word: 'global scale', thaiMeaning: 'ระดับโลก' },
      { word: 'daily life', thaiMeaning: 'ชีวิตประจำวัน' }
    ]
  },
  {
    id: 't2-twe-11',
    number: 11,
    typeId: 'to-what-extent',
    title: 'Financial Aid to Poor Countries',
    questionText:
      'Rich countries often give money to poorer countries, but this does not solve the problem of poverty. Therefore, developed countries should provide other types of assistance to poor countries, rather than financial assistance. To what extent do you agree or disagree?',
    meta: 'France · Apr 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while financial aid provides immediate relief, giving money to poorer countries does not solve the underlying problem of poverty. Others argue that direct financial assistance remains essential, since developing countries urgently need funds for basic needs. I personally believe that developed countries should provide other forms of assistance instead of money alone, and my reasons will be elaborated on in the following paragraphs."
      },
      {
        role: 'body1',
        text: "To begin with, it might seem sensible for some to claim that financial aid remains the most important form of assistance for poorer countries. To explain it simply, this is possibly because money can be used immediately to buy food, medicine, and other urgent necessities; therefore, some believe cutting financial support would worsen suffering in the short term. For example, emergency cash transfers have helped many communities survive immediately after natural disasters such as floods and earthquakes. From this perspective, it is understandable why some would believe that financial aid remains indispensable for struggling nations."
      },
      {
        role: 'body2',
        text: "However, I would personally argue in favor of the idea that developed countries should offer alternative forms of assistance rather than money alone. To put it simply, this is due to the fact that direct cash aid often fails to build lasting infrastructure or institutions, which are necessary for genuine long-term development. For instance, a World Bank report published in 2021 found that countries receiving technical training and infrastructure support showed stronger economic growth than those receiving cash alone. In this respect, it is evident that practical assistance produces more sustainable results than financial aid by itself."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that financial aid offers valuable short-term relief, I am of the opinion that developed nations should prioritize other forms of assistance, as these create lasting solutions to poverty."
      }
    ],
    vocab: [
      { word: 'financial assistance', thaiMeaning: 'ความช่วยเหลือทางการเงิน' },
      { word: 'emergency cash transfers', thaiMeaning: 'การโอนเงินช่วยเหลือฉุกเฉิน' },
      { word: 'infrastructure support', thaiMeaning: 'การสนับสนุนด้านโครงสร้างพื้นฐาน' },
      { word: 'economic growth', thaiMeaning: 'การเติบโตทางเศรษฐกิจ' }
    ]
  },
  {
    id: 't2-twe-12',
    number: 12,
    typeId: 'to-what-extent',
    title: "Digital Devices and Young People's Literacy",
    questionText:
      "Some people believe that the increasing use of computers and mobile phones for communication is having a negative impact on the reading and writing skills of young people. Do you agree or disagree?",
    meta: 'Ghana · Apr 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while digital communication offers great convenience, the increasing use of computers and mobile phones is damaging young people's reading and writing skills. Others argue that digital devices actually strengthen literacy, since young people read and write constantly through messaging and social media. I personally believe that heavy reliance on digital devices is harming literacy skills, and my reasons will be elaborated on in the following paragraphs."
      },
      {
        role: 'body1',
        text: "To begin with, it might seem sensible for some to claim that digital communication improves reading and writing among young people. To explain it simply, this is possibly because texting and social media require constant reading and typing throughout the day; therefore, some believe this frequent practice naturally strengthens literacy skills. For example, many teenagers exchange dozens of text messages daily, engaging with written language far more often than previous generations did. From this perspective, it is understandable why some would believe that digital communication supports rather than damages literacy development."
      },
      {
        role: 'body2',
        text: "However, I would personally argue in favor of the idea that heavy use of digital devices is weakening young people's core literacy skills. To put it simply, this is due to the fact that informal messaging relies on abbreviations and simplified grammar, which fails to develop proper writing structure and vocabulary. For instance, a 2021 study by the National Literacy Trust in the UK found that teenagers who spent excessive time messaging showed noticeably weaker formal writing abilities than peers who read printed books regularly. In this respect, it is evident that digital habits often replace rather than reinforce genuine literacy development."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that digital devices encourage frequent reading and writing, I am of the opinion that heavy reliance on them is weakening young people's literacy skills overall."
      }
    ],
    vocab: [
      { word: 'digital communication', thaiMeaning: 'การสื่อสารดิจิทัล' },
      { word: 'written language', thaiMeaning: 'ภาษาเขียน' },
      { word: 'writing structure', thaiMeaning: 'โครงสร้างการเขียน' },
      { word: 'literacy development', thaiMeaning: 'พัฒนาการด้านการอ่านออกเขียนได้' }
    ]
  },
  {
    id: 't2-twe-13',
    number: 13,
    typeId: 'to-what-extent',
    title: 'Are Women Better Leaders Than Men?',
    questionText:
      'Some people believe women are better leaders than men. To what extent do you agree or disagree with this statement?',
    meta: 'Turkey · May 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while leadership ability varies between individuals, women make better leaders than men in most professional settings. Others argue that leadership skill depends entirely on personal qualities rather than gender, meaning neither group is inherently superior. I personally believe that leadership ability is not determined by gender, and my reasons will be elaborated on in the following paragraphs."
      },
      {
        role: 'body1',
        text: "To begin with, it might seem sensible for some to claim that women generally make better leaders than men. To explain it simply, this is possibly because women are often perceived as more collaborative and empathetic communicators; therefore, some believe teams led by women experience stronger morale and cooperation. For example, several well-known female chief executives, including the former leader of PepsiCo, are frequently praised for their inclusive management style. From this perspective, it is understandable why some would believe that women possess natural advantages in leadership roles."
      },
      {
        role: 'body2',
        text: "However, I would personally argue in favor of the idea that leadership quality depends on individual traits rather than gender. To put it simply, this is due to the fact that effective leadership relies on skills such as decisiveness and vision, which men and women develop equally through experience and training. For instance, a 2019 Harvard Business Review analysis of thousands of managers found no significant difference in overall leadership effectiveness between men and women. In this respect, it is evident that gender alone cannot reliably predict who will become a successful leader."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that certain leadership styles are sometimes associated with one gender, I am of the opinion that individual ability, rather than gender, ultimately determines leadership success."
      }
    ],
    vocab: [
      { word: 'leadership ability', thaiMeaning: 'ความสามารถในการเป็นผู้นำ' },
      { word: 'management style', thaiMeaning: 'รูปแบบการบริหารจัดการ' },
      { word: 'individual traits', thaiMeaning: 'คุณลักษณะเฉพาะบุคคล' },
      { word: 'leadership effectiveness', thaiMeaning: 'ประสิทธิผลของการเป็นผู้นำ' }
    ]
  },
  {
    id: 't2-twe-14',
    number: 14,
    typeId: 'to-what-extent',
    title: 'Should Sugary Products Cost More?',
    questionText:
      'Many manufactured food and drink products contain high levels of sugar, which causes many health problems. Sugary products should be made more expensive to encourage people to consume less sugar. Do you agree or disagree?',
    meta: 'South Africa · Jun 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while sugary food and drinks remain popular consumer choices, making these products more expensive would encourage people to consume less sugar. Others argue that raising prices unfairly punishes consumers instead of addressing the root causes of unhealthy eating habits. I personally believe that increasing the price of sugary products is an effective health measure, and my reasons will be elaborated on in the following paragraphs."
      },
      {
        role: 'body1',
        text: "To begin with, it might seem sensible for some to claim that raising prices on sugary products is an unfair and ineffective solution. To explain it simply, this is possibly because higher prices affect low-income families far more severely than wealthier ones. For example, families on tight budgets might struggle financially if the price of everyday snacks and soft drinks suddenly increases. From this perspective, it is understandable why some would believe that price increases unfairly burden certain groups in society."
      },
      {
        role: 'body2',
        text: "However, I would personally argue in favor of the idea that raising the price of sugary products effectively reduces consumption. To put it simply, this is due to the fact that higher prices directly discourage purchasing, which research consistently shows changes consumer behavior. For instance, after Mexico introduced a sugar tax in 2014, a study published in the British Medical Journal found that purchases of sugary drinks fell by more than seven percent within two years. In this respect, it is evident that pricing policies can meaningfully reduce excessive sugar consumption nationwide."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that higher prices may place some financial pressure on consumers, I am of the opinion that making sugary products more expensive remains an effective way to improve public health."
      }
    ],
    vocab: [
      { word: 'unhealthy eating habits', thaiMeaning: 'พฤติกรรมการกินที่ไม่ดีต่อสุขภาพ' },
      { word: 'low-income families', thaiMeaning: 'ครอบครัวรายได้น้อย' },
      { word: 'consumer behavior', thaiMeaning: 'พฤติกรรมผู้บริโภค' },
      { word: 'pricing policies', thaiMeaning: 'นโยบายด้านราคา' }
    ]
  },
  {
    id: 't2-twe-15',
    number: 15,
    typeId: 'to-what-extent',
    title: 'Space Research Funding',
    questionText:
      'Space research costs billions of dollars. Some people believe that the money should be invested on more practical projects here on Earth. To what extent do you agree or disagree with this opinion?',
    meta: 'Hong Kong · Jun 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while space exploration captures public imagination, the billions spent on space research should instead be invested in more practical projects on Earth. Others argue that space research itself produces practical benefits that justify its enormous cost. I personally believe that space research funding is justified despite its high cost, and my reasons will be elaborated on in the following paragraphs."
      },
      {
        role: 'body1',
        text: "To begin with, it might seem sensible for some to claim that space research funding should be redirected toward more urgent problems on Earth. To explain it simply, this is possibly because issues such as poverty and disease affect billions of people directly; therefore, some believe this money could save more lives if spent elsewhere. For example, critics often point out that the cost of a single space mission could fund hospitals or schools in developing countries for years. From this perspective, it is understandable why some would believe that space spending should be reduced in favor of practical earthly needs."
      },
      {
        role: 'body2',
        text: "However, I would personally argue in favor of the idea that space research funding remains a worthwhile investment. To put it simply, this is due to the fact that many everyday technologies, including satellite navigation and weather forecasting, originally developed from space research, which has benefited society enormously. For instance, NASA estimates that its research has contributed to the development of over two thousand commercial products, including improvements in medical imaging technology. In this respect, it is evident that space research delivers practical benefits that extend far beyond exploration itself."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that pressing problems on Earth deserve significant funding, I am of the opinion that continued investment in space research is justified by its wide-ranging practical benefits."
      }
    ],
    vocab: [
      { word: 'space exploration', thaiMeaning: 'การสำรวจอวกาศ' },
      { word: 'satellite navigation', thaiMeaning: 'ระบบนำทางด้วยดาวเทียม' },
      { word: 'medical imaging technology', thaiMeaning: 'เทคโนโลยีการถ่ายภาพทางการแพทย์' },
      { word: 'practical benefits', thaiMeaning: 'ประโยชน์เชิงปฏิบัติ' }
    ]
  },

  // ── Discuss Both Views ──────────────────────────────────────────────
  {
    id: 't2-dbv-1',
    number: 1,
    typeId: 'discuss-both-views',
    title: 'Subways vs. Wider Roads',
    questionText:
      'Some people believe that governments should invest more in public transport such as subways and trains to reduce traffic congestion. Others think that building more and wider roads is a better solution. Discuss both views and give your own opinion.',
    meta: 'Thailand · Jun 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "While it is argued by some that governments should invest in subway and train networks to ease traffic congestion, others claim that building wider roads is a more effective solution. Both points of view will be elaborated on before elaborating on the reasons why I believe that investing in public transport is the better approach."
      },
      {
        role: 'body1',
        text: "To begin with, it might seem sensible for some to claim that expanding subway and train networks is the most effective way to reduce congestion. To explain this simply, this is because a well-developed rail system can transport many passengers away from private vehicles, cutting the number of cars on the road. For example, Singapore's Mass Rapid Transit network carries more than three million passengers daily, easing congestion across its road network."
      },
      {
        role: 'body2',
        text: "However, some might argue that building more and wider roads is a more practical solution. To put it simply, this is due to the fact that road expansion allows a greater volume of vehicles to travel at once, reducing bottlenecks during peak hours. For instance, a 2018 study by the Texas Transportation Institute found that widening key highways in Houston cut average commute times by nearly 10%."
      },
      {
        role: 'body3',
        text: "Personally, I would argue in favor of the idea that investing in subway and train lines brings more sustainable, long-term benefits. My reasoning is that, unlike roads, rail networks encourage a lasting shift away from private car use, preventing congestion from returning as cities grow. To illustrate, London's Underground has allowed the city to keep up with steady population growth for over a century without expanding its road capacity."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that expanding road networks can offer a quicker, short-term reduction in congestion, I am of the opinion that investing in subway and train lines is the wiser long-term solution."
      }
    ],
    vocab: [
      { word: 'traffic congestion', thaiMeaning: 'ปัญหาการจราจรติดขัด' },
      { word: 'commute times', thaiMeaning: 'เวลาเดินทางไป-กลับ' },
      { word: 'population growth', thaiMeaning: 'การเติบโตของประชากร' },
      { word: 'road capacity', thaiMeaning: 'ความจุของถนน' }
    ]
  },
  {
    id: 't2-dbv-2',
    number: 2,
    typeId: 'discuss-both-views',
    title: 'Who Should Reduce Packaging?',
    questionText:
      'Some people think that supermarkets and manufacturers are responsible for reducing the amount of packaging on the products they sell. Others believe that it is the responsibility of consumers to avoid buying over-packaged products. Discuss both views and give your own opinion.',
    meta: 'India · Jun 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "While it is argued by some that supermarkets and manufacturers have a duty to reduce the packaging of the products they sell, others claim that consumers themselves must take responsibility by avoiding heavily packaged products. Both points of view will be elaborated on before elaborating on the reasons why I believe that manufacturers bear the greater responsibility."
      },
      {
        role: 'body1',
        text: "To begin with, it might seem sensible for some to claim that manufacturers should take primary responsibility for reducing packaging. To explain this simply, this is because companies control product design and could switch to more sustainable materials at the source. For example, several major supermarket chains in the UK have removed plastic packaging from fresh produce, cutting plastic waste by thousands of tonnes annually."
      },
      {
        role: 'body2',
        text: "However, some might argue that consumers hold greater responsibility for this issue. To put it simply, this is due to the fact that consumer demand ultimately drives what products companies choose to package and sell. For instance, a growing number of shoppers now choose loose fruit and vegetables over pre-packaged alternatives, encouraging retailers to offer more unpackaged options."
      },
      {
        role: 'body3',
        text: "Personally, I would argue in favor of the idea that manufacturers should bear the greater share of responsibility. My reasoning is that ordinary consumers often have limited alternatives, since most products are still sold in fixed packaging regardless of individual preference. To illustrate, shoppers in many countries cannot buy household staples such as rice or shampoo without some form of plastic packaging, no matter how environmentally conscious they are."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that consumer choices can influence packaging habits to some extent, I am of the opinion that manufacturers hold the greater responsibility, as they ultimately control how products are packaged."
      }
    ],
    vocab: [
      { word: 'plastic waste', thaiMeaning: 'ขยะพลาสติก' },
      { word: 'consumer demand', thaiMeaning: 'ความต้องการของผู้บริโภค' },
      { word: 'household staples', thaiMeaning: 'ของใช้จำเป็นในครัวเรือน' },
      { word: 'product design', thaiMeaning: 'การออกแบบผลิตภัณฑ์' }
    ]
  },
  {
    id: 't2-dbv-3',
    number: 3,
    typeId: 'discuss-both-views',
    title: 'Genetic Engineering: Benefit or Threat?',
    questionText:
      'Some people believe that genetic engineering will greatly benefit humanity, while others think it poses a serious danger to life on Earth. Discuss both views and give your own opinion.',
    meta: 'Turkey · Jun 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "While it is argued by some that genetic engineering will greatly improve human lives, others claim that it poses a serious threat to life on earth. Both points of view will be elaborated on before elaborating on the reasons why I believe that genetic engineering brings more benefits than risks."
      },
      {
        role: 'body1',
        text: "To begin with, it might seem sensible for some to claim that genetic engineering offers significant benefits to humanity. To explain this simply, this is because scientists can now modify genes to prevent inherited diseases before they even develop. For example, gene therapy has already been used to successfully treat patients with sickle cell disease in several clinical trials."
      },
      {
        role: 'body2',
        text: "However, some might argue that genetic engineering poses serious dangers to life on earth. To put it simply, this is due to the fact that altering genes could produce unpredictable and irreversible effects on ecosystems and future generations. For instance, genetically modified crops have been linked to reduced biodiversity in some farming regions where they have been widely planted."
      },
      {
        role: 'body3',
        text: "Personally, I would argue in favor of the idea that the benefits of genetic engineering outweigh its risks. My reasoning is that, with strict international regulation, the technology's dangers can be managed while its life-saving potential is preserved. To illustrate, countries such as the UK now require rigorous ethical approval before any gene-editing research can proceed, significantly reducing the likelihood of harmful outcomes."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that genetic engineering carries certain risks, I am of the opinion that its potential to improve human health makes it a worthwhile technology to pursue."
      }
    ],
    vocab: [
      { word: 'inherited diseases', thaiMeaning: 'โรคทางพันธุกรรม' },
      { word: 'gene therapy', thaiMeaning: 'การบำบัดด้วยยีน' },
      { word: 'ethical approval', thaiMeaning: 'การอนุมัติด้านจริยธรรม' },
      { word: 'biodiversity', thaiMeaning: 'ความหลากหลายทางชีวภาพ' }
    ]
  },
  {
    id: 't2-dbv-4',
    number: 4,
    typeId: 'discuss-both-views',
    title: 'Who Should Teach Money Management?',
    questionText:
      'Some people think that money management should be taught in schools as a compulsory subject. Others believe that teaching children about finances is the responsibility of parents. Discuss both views and give your own opinion.',
    meta: 'แนวข้อสอบ (Prediction)',
    paragraphs: [
      {
        role: 'intro',
        text: "While it is argued by some that money management should be taught as a mandatory school subject, others claim that teaching children about finances is solely the responsibility of parents. Both points of view will be elaborated on before elaborating on the reasons why I believe that schools should take on this responsibility."
      },
      {
        role: 'body1',
        text: "To begin with, it might seem sensible for some to claim that schools are best placed to teach money management. To explain this simply, this is because teachers can deliver consistent, structured financial education to every student regardless of family background. For example, the UK has included compulsory financial literacy classes in its national curriculum since 2014."
      },
      {
        role: 'body2',
        text: "However, some might argue that teaching children about money is a parental responsibility. To put it simply, this is due to the fact that parents are better placed to demonstrate real financial habits, such as budgeting and saving, within the context of daily family life. For instance, many financially successful adults credit lessons learned from watching their parents manage household budgets."
      },
      {
        role: 'body3',
        text: "Personally, I would argue in favor of the idea that money management should be a mandatory school subject. My reasoning is that not every parent possesses the financial knowledge or confidence needed to teach these skills effectively. To illustrate, a 2019 survey by a UK financial charity found that nearly a third of parents felt unqualified to teach their children about money."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that parents play an important role in shaping children's financial habits, I am of the opinion that schools should take primary responsibility, as this ensures every child receives this essential education."
      }
    ],
    vocab: [
      { word: 'financial literacy', thaiMeaning: 'ความรู้ทางการเงิน' },
      { word: 'household budgets', thaiMeaning: 'งบประมาณครัวเรือน' },
      { word: 'national curriculum', thaiMeaning: 'หลักสูตรแห่งชาติ' },
      { word: 'financial habits', thaiMeaning: 'นิสัยทางการเงิน' }
    ]
  },
  {
    id: 't2-dbv-5',
    number: 5,
    typeId: 'discuss-both-views',
    title: 'Who Should Set School Rules?',
    questionText:
      'Some people believe that students should be involved in making the rules of their school. Others think that this responsibility should remain with teachers. Discuss both views and give your own opinion.',
    meta: 'แนวข้อสอบ (Prediction)',
    paragraphs: [
      {
        role: 'intro',
        text: "While it is argued by some that schoolchildren should be allowed to make decisions about school rules, others claim that teachers should remain responsible for setting these rules. Both points of view will be elaborated on before elaborating on the reasons why I believe that teachers should retain this responsibility."
      },
      {
        role: 'body1',
        text: "To begin with, it might seem sensible for some to claim that students should have a say in creating school rules. To explain this simply, this is because pupils who help design the rules may feel more motivated to follow them. For example, some schools in Finland allow student councils to propose changes to rules on matters such as school uniforms."
      },
      {
        role: 'body2',
        text: "However, some might argue that teachers should remain solely responsible for setting school rules. To put it simply, this is due to the fact that teachers have the experience and training needed to judge which rules genuinely support learning and safety. For instance, decisions such as classroom discipline policies require an understanding of child development that most students do not yet have."
      },
      {
        role: 'body3',
        text: "Personally, I would argue in favor of the idea that teachers should retain primary responsibility for school rules. My reasoning is that children often lack the long-term perspective needed to judge the consequences of the rules they might propose. To illustrate, a rule allowing unlimited phone use during lessons might seem appealing to students but could seriously damage their academic performance."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that involving students can improve their sense of ownership over school life, I am of the opinion that teachers should retain responsibility for setting rules, as they are better placed to protect students' long-term interests."
      }
    ],
    vocab: [
      { word: 'student councils', thaiMeaning: 'สภานักเรียน' },
      { word: 'classroom discipline', thaiMeaning: 'ระเบียบวินัยในห้องเรียน' },
      { word: 'academic performance', thaiMeaning: 'ผลการเรียน' },
      { word: 'long-term perspective', thaiMeaning: 'มุมมองระยะยาว' }
    ]
  },
  {
    id: 't2-dbv-6',
    number: 6,
    typeId: 'discuss-both-views',
    title: 'Old Buildings: Preserve or Replace?',
    questionText:
      "Some people think it is important to keep and maintain old buildings rather than replacing them with modern buildings. Discuss both views and give your own opinion.",
    meta: 'India · Jun 2026 (ข้อสอบจริง)',
    paragraphs: [
      { role: 'intro', text: "While it is argued by some that old buildings should be preserved rather than replaced, others claim that constructing modern buildings better serves a city's practical needs. Both points of view will be elaborated on before elaborating on the reasons why I believe that preservation should generally be prioritized." },
      { role: 'body1', text: "To begin with, it might seem sensible for some to claim that old buildings should be preserved rather than replaced. To explain this simply, this is because these structures hold historical and cultural value that cannot be recreated once demolished. For example, cities such as Kyoto attract millions of visitors annually largely because of their carefully preserved traditional buildings." },
      { role: 'body2', text: "However, some might argue that replacing old buildings with modern ones is the more sensible option. To put it simply, this is due to the fact that new buildings can be designed to meet current safety standards and housing demand far more efficiently. For instance, a 2020 report by the Mori Memorial Foundation found that redeveloped districts in Tokyo increased usable housing space by over 40%." },
      { role: 'body3', text: "Personally, I would argue in favor of the idea that preservation should generally take priority over redevelopment. My reasoning is that historic buildings, once lost, can never be restored to their original form or authenticity. To illustrate, the reconstruction efforts following the 2019 Notre-Dame fire in Paris cost hundreds of millions of euros yet still could not fully replicate certain original features." },
      { role: 'conclusion', text: "In conclusion, although it is undeniable that new developments can address urgent housing and safety needs, I am of the opinion that preserving old buildings should remain the priority, given their irreplaceable cultural value." }
    ],
    vocab: [
      { word: 'cultural value', thaiMeaning: 'คุณค่าทางวัฒนธรรม' },
      { word: 'housing demand', thaiMeaning: 'ความต้องการที่อยู่อาศัย' },
      { word: 'reconstruction efforts', thaiMeaning: 'ความพยายามในการบูรณะ' },
      { word: 'original features', thaiMeaning: 'ลักษณะดั้งเดิม' }
    ]
  },
  {
    id: 't2-dbv-7',
    number: 7,
    typeId: 'discuss-both-views',
    title: 'International Contacts vs. National Identity',
    questionText:
      'Some people believe that increasing business and cultural contacts between countries is a positive development. Others think that many countries will lose their national identity as a result. Discuss both views and give your own opinion.',
    meta: 'Hong Kong · Jul 2026 (ข้อสอบจริง)',
    paragraphs: [
      { role: 'intro', text: "While it is argued by some that growing business and cultural contact between countries is a positive development, others claim that many nations risk losing their national identity as a result. Both points of view will be elaborated on before elaborating on the reasons why I believe that the benefits of this trend outweigh the risks." },
      { role: 'body1', text: "To begin with, it might seem sensible for some to claim that increasing international contact is a positive development. To explain this simply, this is because closer business and cultural ties allow countries to share knowledge, technology, and economic opportunities more freely. For example, trade between European Union member states has grown substantially since border restrictions were reduced." },
      { role: 'body2', text: "However, some might argue that this trend threatens the survival of national identity. To put it simply, this is due to the fact that constant exposure to foreign culture can gradually weaken traditional customs, languages, and values. For instance, a 2017 UNESCO report warned that hundreds of minority languages worldwide face extinction due to the dominance of globally spoken languages." },
      { role: 'body3', text: "Personally, I would argue in favor of the idea that the benefits of international contact outweigh the risks to national identity. My reasoning is that most countries continue to actively protect their traditions through education and cultural policy despite growing global exchange. To illustrate, South Korea has combined rapid international business expansion with strong government support for traditional arts, which remain widely practiced today." },
      { role: 'conclusion', text: "In conclusion, although it is undeniable that some erosion of local culture may occur, I am of the opinion that the economic and social benefits of international contact make it a positive development overall." }
    ],
    vocab: [
      { word: 'national identity', thaiMeaning: 'อัตลักษณ์ของชาติ' },
      { word: 'traditional customs', thaiMeaning: 'ขนบธรรมเนียมดั้งเดิม' },
      { word: 'cultural policy', thaiMeaning: 'นโยบายด้านวัฒนธรรม' },
      { word: 'global exchange', thaiMeaning: 'การแลกเปลี่ยนระดับโลก' }
    ]
  },
  {
    id: 't2-dbv-8',
    number: 8,
    typeId: 'discuss-both-views',
    title: 'Hotels vs. Holiday Homes',
    questionText:
      'Some people prefer staying in hotels when they travel, while others prefer renting holiday homes for a short period of time. Discuss both views and give your own opinion.',
    meta: 'UAE · Mar 2026 (ข้อสอบจริง)',
    paragraphs: [
      { role: 'intro', text: "While it is argued by some that staying in hotels is the best option when travelling, others claim that renting holiday homes offers a better experience. Both points of view will be elaborated on before elaborating on the reasons why I believe that holiday homes are generally the wiser choice." },
      { role: 'body1', text: "To begin with, it might seem sensible for some to claim that hotels are the more convenient option for travellers. To explain this simply, this is because hotels typically provide professional staff, daily cleaning, and on-site facilities such as restaurants and gyms. For example, major hotel chains like Marriott offer round-the-clock guest services that many independent holiday rentals simply cannot match." },
      { role: 'body2', text: "However, some might argue that renting a holiday home provides a more rewarding travel experience. To put it simply, this is due to the fact that holiday homes usually offer more space, privacy, and the chance to live like a local resident. For instance, a 2021 survey by Airbnb found that over 60% of guests chose holiday rentals specifically to experience neighbourhoods that typical hotels do not reach." },
      { role: 'body3', text: "Personally, I would argue in favor of the idea that holiday homes are generally the better accommodation choice. My reasoning is that they allow travellers, particularly families, to save money on meals by using a kitchen while enjoying considerably more living space. To illustrate, a family of four renting an apartment in Barcelona can often pay less than the cost of two separate hotel rooms while gaining a full kitchen and living area." },
      { role: 'conclusion', text: "In conclusion, although it is undeniable that hotels offer valuable convenience and professional service, I am of the opinion that holiday homes provide better overall value for most travellers." }
    ],
    vocab: [
      { word: 'guest services', thaiMeaning: 'บริการสำหรับผู้เข้าพัก' },
      { word: 'local resident', thaiMeaning: 'ผู้อยู่อาศัยในท้องถิ่น' },
      { word: 'holiday rentals', thaiMeaning: 'ที่พักให้เช่าสำหรับวันหยุด' },
      { word: 'living area', thaiMeaning: 'พื้นที่นั่งเล่น' }
    ]
  },
  {
    id: 't2-dbv-9',
    number: 9,
    typeId: 'discuss-both-views',
    title: 'Homework: Alone or With Parents?',
    questionText:
      "Some people believe that students should do their homework independently, while others think that parents should help their children with homework. Discuss both views and give your own opinion.",
    meta: 'Australia · Apr 2026 (ข้อสอบจริง)',
    paragraphs: [
      { role: 'intro', text: "While it is argued by some that students should complete homework independently, others claim that parents should actively help their children with it. Both points of view will be elaborated on before elaborating on the reasons why I believe that independent homework brings greater long-term benefits." },
      { role: 'body1', text: "To begin with, it might seem sensible for some to claim that parents should help their children with homework. To explain this simply, this is because parental involvement can quickly clear up confusion and prevent children from developing frustration over difficult subjects. For example, many parents in Singapore regularly guide their children through mathematics homework to reinforce concepts taught earlier that day." },
      { role: 'body2', text: "However, some might argue that students should complete homework entirely on their own. To put it simply, this is due to the fact that working independently forces students to develop problem-solving skills and self-discipline that constant assistance cannot provide. For instance, a 2016 study published in the Journal of Educational Psychology found that students who completed homework unaided showed stronger long-term retention of material." },
      { role: 'body3', text: "Personally, I would argue in favor of the idea that independent homework offers the greater long-term benefit. My reasoning is that children who struggle through problems alone learn to manage setbacks, a skill essential for success far beyond the classroom. To illustrate, university students who received little parental help with homework as children often report adapting more easily to independent study without supervision." },
      { role: 'conclusion', text: "In conclusion, although it is undeniable that parental support can ease short-term academic pressure, I am of the opinion that allowing children to complete homework independently builds more valuable lifelong skills." }
    ],
    vocab: [
      { word: 'parental involvement', thaiMeaning: 'การมีส่วนร่วมของผู้ปกครอง' },
      { word: 'problem-solving skills', thaiMeaning: 'ทักษะการแก้ปัญหา' },
      { word: 'self-discipline', thaiMeaning: 'วินัยในตนเอง' },
      { word: 'independent study', thaiMeaning: 'การเรียนรู้ด้วยตนเอง' }
    ]
  },
  {
    id: 't2-dbv-10',
    number: 10,
    typeId: 'discuss-both-views',
    title: 'Salary vs. Positive Work Environment',
    questionText:
      'Some people believe that earning a high salary is the most important factor when choosing an employer, while others think that a positive working environment is more important. Discuss both views and give your own opinion.',
    meta: 'Australia · Feb 2026 (ข้อสอบจริง)',
    paragraphs: [
      { role: 'intro', text: "While it is argued by some that a high salary is the most important factor when choosing an employer, others claim that a positive working environment matters more. Both points of view will be elaborated on before elaborating on the reasons why I believe that a positive workplace ultimately matters most." },
      { role: 'body1', text: "To begin with, it might seem sensible for some to claim that a high salary should be the deciding factor when choosing an employer. To explain this simply, this is because greater income allows employees to meet financial needs and achieve a more comfortable standard of living. For example, many graduates in finance accept demanding roles at investment banks specifically because of the exceptionally high starting salaries offered." },
      { role: 'body2', text: "However, some might argue that a positive working environment is more important than pay. To put it simply, this is due to the fact that supportive colleagues and manageable workloads directly affect an employee's happiness and long-term motivation. For instance, a 2019 Gallup workplace study found that employees who rated their workplace culture highly were far less likely to leave their jobs within a year." },
      { role: 'body3', text: "Personally, I would argue in favor of the idea that a positive working environment matters more than salary alone. My reasoning is that even a generous salary cannot compensate for constant stress, unclear expectations, or poor management over time. To illustrate, technology companies such as Google have long attracted top talent partly because of their supportive workplace culture rather than salary alone." },
      { role: 'conclusion', text: "In conclusion, although it is undeniable that a high salary provides essential financial security, I am of the opinion that a positive working environment matters more for long-term job satisfaction." }
    ],
    vocab: [
      { word: 'standard of living', thaiMeaning: 'มาตรฐานการครองชีพ' },
      { word: 'workplace culture', thaiMeaning: 'วัฒนธรรมองค์กร' },
      { word: 'long-term motivation', thaiMeaning: 'แรงจูงใจระยะยาว' },
      { word: 'job satisfaction', thaiMeaning: 'ความพึงพอใจในงาน' }
    ]
  },
  {
    id: 't2-dbv-11',
    number: 11,
    typeId: 'discuss-both-views',
    title: "Children's Life: Past vs. Present",
    questionText:
      'Some people believe that children in the past had an easier life, while others think that life is easier for children today. Discuss both views and give your own opinion.',
    meta: 'Italy · Jan 2026 (ข้อสอบจริง)',
    paragraphs: [
      { role: 'intro', text: "While it is argued by some that children in the past had an easier life, others claim that children today actually enjoy greater advantages. Both points of view will be elaborated on before elaborating on the reasons why I believe that children today generally have it easier." },
      { role: 'body1', text: "To begin with, it might seem sensible for some to claim that children in the past experienced an easier life. To explain this simply, this is because past generations faced fewer academic pressures and enjoyed more unstructured outdoor play with neighbourhood friends. For example, many adults who grew up in the 1970s recall spending entire afternoons playing outside without any scheduled activities." },
      { role: 'body2', text: "However, some might argue that children today have an easier life than previous generations. To put it simply, this is due to the fact that modern children benefit from far greater access to healthcare, education, and technology than their parents or grandparents did. For instance, global child mortality rates have fallen by more than half since 1990, according to UNICEF data." },
      { role: 'body3', text: "Personally, I would argue in favor of the idea that children today generally enjoy an easier life overall. My reasoning is that today's children can access vast educational resources instantly, something previous generations could only dream of. To illustrate, a student in a rural village can now use a smartphone to watch free university lectures from institutions such as MIT." },
      { role: 'conclusion', text: "In conclusion, although it is undeniable that today's children face new pressures such as academic competition and social media, I am of the opinion that children today ultimately have an easier life thanks to modern healthcare and education." }
    ],
    vocab: [
      { word: 'academic pressures', thaiMeaning: 'ความกดดันด้านการเรียน' },
      { word: 'child mortality rates', thaiMeaning: 'อัตราการเสียชีวิตของเด็ก' },
      { word: 'educational resources', thaiMeaning: 'ทรัพยากรทางการศึกษา' },
      { word: 'academic competition', thaiMeaning: 'การแข่งขันด้านการเรียน' }
    ]
  },
  {
    id: 't2-dbv-12',
    number: 12,
    typeId: 'discuss-both-views',
    title: 'Free Public Libraries: Worth It?',
    questionText:
      'Some believe that the government should set up free libraries in every city, while others think it is a waste of money. Discuss both views and give your own opinion.',
    meta: 'Sweden · Jun 2026 (ข้อสอบจริง)',
    paragraphs: [
      { role: 'intro', text: "While it is argued by some that governments should establish free public libraries in every city, others claim that this would be a wasteful use of public funds. Both points of view will be elaborated on before elaborating on the reasons why I believe that funding free libraries remains a worthwhile investment." },
      { role: 'body1', text: "To begin with, it might seem sensible for some to claim that governments should provide free public libraries in every city. To explain this simply, this is because libraries give every resident, regardless of income, equal access to books, computers, and quiet study spaces. For example, public libraries across Finland offer free internet access and study rooms that are heavily used by students and job seekers alike." },
      { role: 'body2', text: "However, some might argue that building free libraries in every city wastes government money. To put it simply, this is due to the fact that most information is now freely available online, making costly physical library buildings increasingly unnecessary. For instance, a 2018 report noted that public library visits in several major American cities had declined by nearly 20% over the previous decade." },
      { role: 'body3', text: "Personally, I would argue in favor of the idea that free public libraries remain a worthwhile government investment. My reasoning is that libraries serve elderly residents and low-income families who often lack reliable internet access or personal devices at home. To illustrate, community libraries in rural areas of the UK continue to host free digital literacy classes for residents who cannot otherwise get online." },
      { role: 'conclusion', text: "In conclusion, although it is undeniable that online information has reduced some demand for physical libraries, I am of the opinion that governments should continue funding them to support disadvantaged communities." }
    ],
    vocab: [
      { word: 'public funds', thaiMeaning: 'เงินทุนสาธารณะ' },
      { word: 'study spaces', thaiMeaning: 'พื้นที่สำหรับอ่านหนังสือ' },
      { word: 'digital literacy', thaiMeaning: 'ความรู้ด้านดิจิทัล' },
      { word: 'disadvantaged communities', thaiMeaning: 'ชุมชนผู้ด้อยโอกาส' }
    ]
  },
  {
    id: 't2-dbv-13',
    number: 13,
    typeId: 'discuss-both-views',
    title: "Parents vs. TV and Friends",
    questionText:
      "Some people believe that parents have the most important role in a child's development. However, others argue that other things like television or friends have the most significant influence. Discuss both views and give your own opinion.",
    meta: 'Saudi Arabia · Jun 2026 (ข้อสอบจริง)',
    paragraphs: [
      { role: 'intro', text: "While it is argued by some that parents have the most important role in a child's development, others claim that outside influences such as television and friends matter more. Both points of view will be elaborated on before elaborating on the reasons why I believe that parents remain the most influential factor." },
      { role: 'body1', text: "To begin with, it might seem sensible for some to claim that outside influences such as television and friends shape children more than parents do. To explain this simply, this is because children spend a considerable amount of time consuming media and interacting with peers outside parental supervision. For example, a 2020 Ofcom report found that children in the UK aged eight to eleven spend over 13 hours per week watching online video content." },
      { role: 'body2', text: "However, some might argue that parents remain the most important influence on a child's development. To put it simply, this is due to the fact that parents shape a child's earliest values, habits, and emotional security long before outside influences take hold. For instance, children raised in emotionally supportive households consistently show stronger academic and social outcomes according to long-term developmental research." },
      { role: 'body3', text: "Personally, I would argue in favor of the idea that parents remain the most significant influence on child development. My reasoning is that parents largely control which friends, schools, and media their children are exposed to during formative years. To illustrate, parents who actively limit screen time and encourage reading often raise children with noticeably stronger language skills by primary school age." },
      { role: 'conclusion', text: "In conclusion, although it is undeniable that television and friends increasingly shape children's attitudes, I am of the opinion that parents remain the single most important influence on a child's development." }
    ],
    vocab: [
      { word: 'parental supervision', thaiMeaning: 'การดูแลของผู้ปกครอง' },
      { word: 'emotional security', thaiMeaning: 'ความมั่นคงทางอารมณ์' },
      { word: 'developmental research', thaiMeaning: 'งานวิจัยด้านพัฒนาการ' },
      { word: 'formative years', thaiMeaning: 'ช่วงวัยที่หล่อหลอมบุคลิกภาพ' }
    ]
  },
  {
    id: 't2-dbv-14',
    number: 14,
    typeId: 'discuss-both-views',
    title: 'Dangerous Sports: Ban or Allow Choice?',
    questionText:
      'Some people think that dangerous sports should be banned. While others think that people should be free to choose their sport. Discuss both views and give your own opinion.',
    meta: 'Canada · Jun 2026 (ข้อสอบจริง)',
    paragraphs: [
      { role: 'intro', text: "While it is argued by some that dangerous sports should be banned, others claim that people should remain free to choose which sports they play. Both points of view will be elaborated on before elaborating on the reasons why I believe that personal freedom should ultimately be protected." },
      { role: 'body1', text: "To begin with, it might seem sensible for some to claim that dangerous sports should be banned altogether. To explain this simply, this is because high-risk activities such as base jumping or free solo climbing carry a genuine risk of severe injury or death. For example, mountain rescue teams in the Swiss Alps respond to hundreds of extreme sports accidents every year." },
      { role: 'body2', text: "However, some might argue that people should be free to choose whichever sports they wish to play. To put it simply, this is due to the fact that adults are capable of assessing personal risk and should not have that choice removed by the state. For instance, professional boxing remains legal in most countries despite its well-documented health risks, reflecting respect for individual choice." },
      { role: 'body3', text: "Personally, I would argue in favor of the idea that personal freedom to choose one's sport should be protected. My reasoning is that banning dangerous sports rarely eliminates the activity but instead pushes participants toward unregulated and less safe alternatives. To illustrate, countries that heavily restrict extreme sports often see enthusiasts travel abroad or practice informally without proper safety equipment or supervision." },
      { role: 'conclusion', text: "In conclusion, although it is undeniable that dangerous sports carry serious risks, I am of the opinion that individuals should retain the freedom to choose which sports they participate in." }
    ],
    vocab: [
      { word: 'high-risk activities', thaiMeaning: 'กิจกรรมที่มีความเสี่ยงสูง' },
      { word: 'personal risk', thaiMeaning: 'ความเสี่ยงส่วนบุคคล' },
      { word: 'individual choice', thaiMeaning: 'ทางเลือกส่วนบุคคล' },
      { word: 'safety equipment', thaiMeaning: 'อุปกรณ์ความปลอดภัย' }
    ]
  },
  {
    id: 't2-dbv-15',
    number: 15,
    typeId: 'discuss-both-views',
    title: 'Routine vs. Embracing Change',
    questionText:
      'Some people prefer to spend their lives doing the same things and avoiding change. Others, however, think that change is always a good thing. Discuss both views and give your own opinion.',
    meta: 'แนวข้อสอบ (Prediction)',
    paragraphs: [
      { role: 'intro', text: "While it is argued by some that people should stick to familiar routines and avoid change, others claim that change is always beneficial. Both points of view will be elaborated on before elaborating on the reasons why I believe that embracing change generally leads to better outcomes." },
      { role: 'body1', text: "To begin with, it might seem sensible for some to claim that avoiding change and maintaining familiar routines is the wiser approach to life. To explain this simply, this is because stable routines reduce uncertainty and allow people to feel secure in their daily responsibilities. For example, many long-serving employees at companies such as Toyota remain in the same role for decades, valuing the stability this provides." },
      { role: 'body2', text: "However, some might argue that change is always a good thing. To put it simply, this is due to the fact that new experiences and challenges push individuals to develop skills they would never otherwise acquire. For instance, a 2015 Harvard Business Review study found that employees who regularly changed roles within a company showed measurably faster skill development than those who did not." },
      { role: 'body3', text: "Personally, I would argue in favor of the idea that embracing change generally produces better long-term outcomes. My reasoning is that industries and technologies evolve constantly, meaning individuals who resist change risk becoming professionally outdated. To illustrate, workers who retrained in digital skills during the rise of automation found new career opportunities that colleagues resistant to change often missed." },
      { role: 'conclusion', text: "In conclusion, although it is undeniable that stable routines offer valuable comfort and security, I am of the opinion that embracing change ultimately leads to greater personal and professional growth." }
    ],
    vocab: [
      { word: 'familiar routines', thaiMeaning: 'กิจวัตรที่คุ้นเคย' },
      { word: 'skill development', thaiMeaning: 'การพัฒนาทักษะ' },
      { word: 'career opportunities', thaiMeaning: 'โอกาสในหน้าที่การงาน' },
      { word: 'professional growth', thaiMeaning: 'ความก้าวหน้าในสายอาชีพ' }
    ]
  },

  // ── Advantages & Disadvantages ──────────────────────────────────────
  {
    id: 't2-ad-1',
    number: 1,
    typeId: 'advantages-disadvantages',
    title: 'Hosting a Major Sporting Event',
    questionText:
      'Hosting major international sporting events, such as the Olympic Games, brings both benefits and drawbacks to the host country. Do the benefits outweigh the drawbacks?',
    meta: 'แนวข้อสอบ (Practice)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while hosting a major international sporting event is both beneficial and detrimental for the host country, this essay argues that the benefits are far greater than the drawbacks."
      },
      {
        role: 'body1',
        text: "To begin with, there are a number of benefits associated with hosting a major sporting event. The first benefit is that it brings significant economic growth through tourism and infrastructure investment, creating thousands of new jobs in the process. For example, the 2012 London Olympics attracted more than 320,000 additional overseas visitors and generated billions of pounds in tourism revenue. Another advantage is that it raises the host country's international profile and national pride. For instance, South Korea's hosting of the 2018 Winter Olympics in Pyeongchang significantly boosted the nation's global recognition as a modern, capable host."
      },
      {
        role: 'body2',
        text: "However, some might be concerned regarding the high cost of hosting such events. This is because building new stadiums and facilities often requires enormous public spending. To illustrate, Brazil spent an estimated 13 billion dollars preparing for the 2016 Rio Olympics, much of which came from public funds. However, this argument is simply invalid given that many host cities recover these costs through long-term tourism and improved infrastructure. For example, Barcelona's 1992 Olympic investment transformed the city into one of Europe's most visited tourist destinations for decades afterward."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that some might be concerned in terms of the financial burden of hosting a major sporting event, I am of the opinion that the benefits, including economic growth and international recognition, are far greater than the drawbacks."
      }
    ],
    vocab: [
      { word: 'tourism revenue', thaiMeaning: 'รายได้จากการท่องเที่ยว' },
      { word: 'infrastructure investment', thaiMeaning: 'การลงทุนโครงสร้างพื้นฐาน' },
      { word: 'global recognition', thaiMeaning: 'การยอมรับระดับโลก' },
      { word: 'public spending', thaiMeaning: 'การใช้จ่ายภาครัฐ' }
    ]
  },
  {
    id: 't2-ad-2',
    number: 2,
    typeId: 'advantages-disadvantages',
    title: 'An Ageing Population',
    questionText:
      'In many countries, the population is ageing. Do the advantages of this trend outweigh the disadvantages?',
    meta: 'แนวข้อสอบ (Practice)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while an ageing population is both beneficial and detrimental for society, this essay argues that the benefits are far greater than the drawbacks."
      },
      {
        role: 'body1',
        text: "To begin with, there are a number of benefits associated with an ageing population. The first benefit is that older citizens bring decades of valuable knowledge and experience to the workforce and community life, helping to train the next generation of workers. For example, many countries now rely on retirees to mentor younger employees, passing on skills that would otherwise be lost. Another advantage is that older generations often provide free childcare, allowing younger family members to remain in full-time employment. For instance, in countries such as Italy, grandparents frequently care for grandchildren while both parents work."
      },
      {
        role: 'body2',
        text: "However, some might be concerned regarding the financial burden that an ageing population places on public services. This is because pensions and healthcare for elderly citizens require significant government spending. To illustrate, Japan now spends more than a fifth of its national budget on social security for elderly citizens. However, this argument is simply invalid given that many governments can offset these costs by raising retirement ages and encouraging continued employment among older citizens. For example, several European countries have successfully reduced pension costs by gradually raising the retirement age to 67."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that some might be concerned in terms of the financial cost of an ageing population, I am of the opinion that the benefits of an ageing population, including experience and family support, are far greater than the drawbacks."
      }
    ],
    vocab: [
      { word: 'retirement age', thaiMeaning: 'อายุเกษียณ' },
      { word: 'social security', thaiMeaning: 'ประกันสังคม' },
      { word: 'workforce', thaiMeaning: 'กำลังแรงงาน' },
      { word: 'free childcare', thaiMeaning: 'การเลี้ยงดูเด็กฟรี' }
    ]
  },
  {
    id: 't2-ad-3',
    number: 3,
    typeId: 'advantages-disadvantages',
    title: 'Parents Working Abroad',
    questionText:
      'Some parents choose to work abroad and take their families with them. Do the benefits of this outweigh the drawbacks?',
    meta: 'แนวข้อสอบ (Practice)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while parents relocating abroad for work is both beneficial and detrimental for their families, this essay argues that the benefits are far greater than the drawbacks."
      },
      {
        role: 'body1',
        text: "To begin with, there are a number of benefits associated with parents working abroad and bringing their families with them. The first benefit is that children gain exposure to new languages and cultures from an early age. For example, children raised in international schools in cities such as Singapore often become fluent in two or more languages by adulthood. Another advantage is that higher overseas salaries can significantly improve a family's overall standard of living. For instance, many expatriate workers in the Gulf region earn several times what they would earn in their home countries."
      },
      {
        role: 'body2',
        text: "However, some might be concerned regarding the disruption this move causes to children's education and social lives. This is because children must adapt to new schools and make new friends, often more than once during their childhood. To illustrate, families who relocate frequently for work may see their children change schools three or four times before finishing secondary education. However, this argument is simply invalid given that international schools are specifically designed to help children adapt quickly, offering strong pastoral support and globally recognised curricula. For example, the International Baccalaureate programme, taught in more than 150 countries, allows students to continue the same curriculum wherever their family relocates."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that some might be concerned in terms of the disruption caused to children's education, I am of the opinion that the benefits of relocating abroad for work, including cultural exposure and financial improvement, are far greater than the drawbacks."
      }
    ],
    vocab: [
      { word: 'standard of living', thaiMeaning: 'มาตรฐานการครองชีพ' },
      { word: 'pastoral support', thaiMeaning: 'การดูแลด้านความเป็นอยู่ของนักเรียน' },
      { word: 'international schools', thaiMeaning: 'โรงเรียนนานาชาติ' },
      { word: 'overseas salaries', thaiMeaning: 'เงินเดือนต่างประเทศ' }
    ]
  },
  {
    id: 't2-ad-4',
    number: 4,
    typeId: 'advantages-disadvantages',
    title: 'International Tourism',
    questionText:
      'International tourism has brought many benefits, but it also has drawbacks for the places tourists visit. Do the benefits of international tourism outweigh the drawbacks?',
    meta: 'แนวข้อสอบ (Practice)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while international tourism is both beneficial and detrimental to the places it affects, this essay argues that the benefits are far greater than the drawbacks."
      },
      {
        role: 'body1',
        text: "To begin with, there are a number of benefits associated with international tourism. The first benefit is that tourism generates substantial income and employment for local communities. For example, tourism accounts for more than 20% of Thailand's total employment, supporting millions of local jobs. Another advantage is that tourism encourages the preservation of local culture and historic sites, as governments invest in maintaining the attractions that draw visitors, creating a cycle of sustained cultural investment. For instance, revenue from tourist entry fees has funded major restoration projects at Cambodia's Angkor Wat temple complex."
      },
      {
        role: 'body2',
        text: "However, some might be concerned regarding the environmental damage caused by large numbers of tourists. This is because popular destinations often experience pollution, overcrowding, and strain on local infrastructure, particularly during peak holiday seasons. To illustrate, some beaches in Thailand have been forced to close temporarily due to coral reef damage from excessive tourist activity. However, this argument is simply invalid given that responsible tourism management, such as visitor limits and eco-certification schemes, can significantly reduce this damage. For example, Bhutan strictly limits tourist numbers and charges a daily fee that directly funds environmental conservation projects."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that some might be concerned in terms of the environmental impact of tourism, I am of the opinion that the benefits of international tourism, including income and cultural preservation, are far greater than the drawbacks."
      }
    ],
    vocab: [
      { word: 'local communities', thaiMeaning: 'ชุมชนท้องถิ่น' },
      { word: 'overcrowding', thaiMeaning: 'ความแออัด' },
      { word: 'visitor limits', thaiMeaning: 'การจำกัดจำนวนนักท่องเที่ยว' },
      { word: 'historic sites', thaiMeaning: 'สถานที่ทางประวัติศาสตร์' }
    ]
  },
  {
    id: 't2-ad-5',
    number: 5,
    typeId: 'advantages-disadvantages',
    title: 'E-books vs. Paper Books',
    questionText:
      'Nowadays, many people prefer to read e-books rather than paper books. Do the benefits of this outweigh the drawbacks?',
    meta: 'แนวข้อสอบ (Practice)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while reading e-books instead of paper books is both beneficial and detrimental, this essay argues that the benefits are far greater than the drawbacks."
      },
      {
        role: 'body1',
        text: "To begin with, there are a number of benefits associated with reading e-books. The first benefit is that e-readers can store thousands of titles in a single lightweight device, making them extremely convenient for travel. For example, a single e-reader weighing under 200 grams can hold an entire personal library of several thousand books. Another advantage is that e-books are typically cheaper than paper books, as they avoid printing and distribution costs. For instance, digital editions of new releases are often priced around 30% lower than their hardcover equivalents, making reading a much cheaper hobby overall."
      },
      {
        role: 'body2',
        text: "However, some might be concerned regarding the loss of the traditional reading experience that paper books provide. This is because many readers associate physical books with better focus and fewer digital distractions, particularly among younger readers. To illustrate, some studies suggest that readers retain information less effectively when reading from a screen. However, this argument is simply invalid given that modern e-readers now use paper-like display technology specifically designed to reduce eye strain and distraction. For example, devices such as the Kindle Paperwhite lack internet browsers entirely, allowing readers to focus solely on their book."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that some might be concerned in terms of the reading experience offered by paper books, I am of the opinion that the benefits of e-books, including convenience and affordability, are far greater than the drawbacks."
      }
    ],
    vocab: [
      { word: 'reading experience', thaiMeaning: 'ประสบการณ์การอ่าน' },
      { word: 'eye strain', thaiMeaning: 'อาการปวดล้าตา' },
      { word: 'printing costs', thaiMeaning: 'ต้นทุนการพิมพ์' },
      { word: 'digital distractions', thaiMeaning: 'สิ่งรบกวนทางดิจิทัล' }
    ]
  },
  {
    id: 't2-ad-6',
    number: 6,
    typeId: 'advantages-disadvantages',
    title: 'Police Officers Carrying Weapons',
    questionText:
      'In some countries, police officers do not carry weapons. Do the benefits of police officers carrying weapons outweigh the drawbacks?',
    meta: 'Saudi Arabia · Jan 2026 (ข้อสอบจริง)',
    paragraphs: [
      { role: 'intro', text: "It has been widely argued that while police officers carrying weapons is both beneficial and detrimental to public safety, this essay argues that the benefits are far greater than the drawbacks." },
      { role: 'body1', text: "To begin with, there are a number of benefits associated with police officers carrying weapons. The first benefit is that armed officers can respond immediately to violent or life-threatening situations. For example, a 2023 UK Home Office report found that armed response units reduced fatal outcomes in hostage situations by acting within minutes of arrival. Another advantage is that visible weapons act as a strong deterrent against attacks on law enforcement personnel. For instance, countries such as the United States report far fewer assaults on officers in districts where armed patrols are standard practice." },
      { role: 'body2', text: "However, some might be concerned regarding the risk of accidental shootings or excessive use of force. This is because officers under pressure may make split-second errors that lead to tragic outcomes. To illustrate, several widely reported cases in American cities have involved unarmed civilians being mistakenly shot during routine stops. However, this argument is simply invalid given that rigorous training and strict accountability procedures can dramatically reduce such errors. For example, Norway's police force carries weapons only in specific circumstances, combining this restraint with extensive de-escalation training that keeps shooting rates among the lowest in Europe." },
      { role: 'conclusion', text: "In conclusion, although it is undeniable that some might be concerned in terms of the risk of misuse of force, I am of the opinion that the benefits of police officers carrying weapons, including rapid emergency response and deterrence against attacks, are far greater than the drawbacks." }
    ],
    vocab: [
      { word: 'armed response units', thaiMeaning: 'หน่วยตอบโต้เหตุด่วนที่มีอาวุธ' },
      { word: 'deterrent', thaiMeaning: 'สิ่งยับยั้ง/ป้องปราม' },
      { word: 'accountability procedures', thaiMeaning: 'กระบวนการตรวจสอบความรับผิดชอบ' },
      { word: 'de-escalation training', thaiMeaning: 'การฝึกลดระดับความรุนแรงของสถานการณ์' }
    ]
  },
  {
    id: 't2-ad-7',
    number: 7,
    typeId: 'advantages-disadvantages',
    title: 'Economic Development and the Loss of Social Values',
    questionText:
      'Nowadays, most countries are improving their standard of living through economic development, but as a result, some social values are lost. Do you think the advantages of this phenomenon outweigh the disadvantages?',
    meta: 'Egypt · Jan 2026 (ข้อสอบจริง)',
    paragraphs: [
      { role: 'intro', text: "It has been widely argued that while rapid economic development is both beneficial and detrimental to traditional social values, this essay argues that the benefits are far greater than the drawbacks." },
      { role: 'body1', text: "To begin with, there are a number of benefits associated with rapid economic development. The first benefit is that it lifts millions of people out of poverty by creating new employment opportunities. For example, a 2022 World Bank study found that China's economic growth since 1990 helped lift more than 800 million citizens out of extreme poverty. Another advantage is that development brings improved healthcare and education systems to ordinary citizens. For instance, Vietnam's rising national income has funded a nationwide expansion of rural hospitals and public schools over the past two decades." },
      { role: 'body2', text: "However, some might be concerned regarding the erosion of traditional customs and family structures. This is because rapid urbanisation often draws young people away from rural communities toward busy city jobs. To illustrate, many villages across Thailand now report shrinking populations, as younger generations move to Bangkok in search of higher wages. However, this argument is simply invalid given that governments can actively preserve cultural heritage while pursuing economic growth. For example, South Korea has combined rapid industrialisation with generous state funding for traditional festivals and heritage sites, ensuring old customs remain visible to younger citizens." },
      { role: 'conclusion', text: "In conclusion, although it is undeniable that some might be concerned in terms of the loss of traditional social values, I am of the opinion that the benefits of economic development, including poverty reduction and improved public services, are far greater than the drawbacks." }
    ],
    vocab: [
      { word: 'extreme poverty', thaiMeaning: 'ความยากจนขั้นรุนแรง' },
      { word: 'national income', thaiMeaning: 'รายได้ประชาชาติ' },
      { word: 'urbanisation', thaiMeaning: 'การกลายเป็นเมือง' },
      { word: 'cultural heritage', thaiMeaning: 'มรดกทางวัฒนธรรม' }
    ]
  },
  {
    id: 't2-ad-8',
    number: 8,
    typeId: 'advantages-disadvantages',
    title: 'Genetically Modified Food Crops',
    questionText:
      'Nowadays genetically modified food products are widespread throughout the world. While proponents ensure that these foods are safe and help increase food supplies, others argue that their health effects have not been studied long enough. Do the advantages of genetically modified crops outweigh the disadvantages?',
    meta: 'UK · Mar 2026 (ข้อสอบจริง)',
    paragraphs: [
      { role: 'intro', text: "It has been widely argued that while growing genetically modified food crops is both beneficial and detrimental to public health, this essay argues that the benefits are far greater than the drawbacks." },
      { role: 'body1', text: "To begin with, there are a number of benefits associated with genetically modified food crops. The first benefit is that they can dramatically increase crop yields, helping to feed growing populations. For example, a 2021 study by the International Food Policy Research Institute found that genetically modified maize increased yields by up to 25% in several African nations. Another advantage is that these crops can be engineered to resist pests and drought, reducing reliance on chemical pesticides. For instance, Bt cotton varieties grown widely in India have cut pesticide use by nearly half since their introduction." },
      { role: 'body2', text: "However, some might be concerned regarding the unknown long-term health effects of consuming modified foods. This is because these crops have only been widely cultivated for a few decades. To illustrate, several consumer groups in the European Union have campaigned for stricter labelling, citing these unresolved health concerns. However, this argument is simply invalid given that major scientific bodies have repeatedly confirmed the safety of approved genetically modified foods. For example, the World Health Organization has reviewed decades of evidence and found no verified case of harm from genetically modified crops currently on the market." },
      { role: 'conclusion', text: "In conclusion, although it is undeniable that some might be concerned in terms of the long-term health effects of modified foods, I am of the opinion that the benefits of genetically modified crops, including higher yields and pest resistance, are far greater than the drawbacks." }
    ],
    vocab: [
      { word: 'crop yields', thaiMeaning: 'ผลผลิตทางการเกษตร' },
      { word: 'chemical pesticides', thaiMeaning: 'ยาฆ่าแมลงเคมี' },
      { word: 'consumer groups', thaiMeaning: 'กลุ่มผู้บริโภค' },
      { word: 'scientific bodies', thaiMeaning: 'องค์กรทางวิทยาศาสตร์' }
    ]
  },
  {
    id: 't2-ad-9',
    number: 9,
    typeId: 'advantages-disadvantages',
    title: 'Storing Information Online Instead of in Books',
    questionText:
      'Nowadays, most of the information is available on the Internet, whereas in the past, knowledge was stored in books and on paper. Do you think the advantages of this situation outweigh its disadvantages?',
    meta: 'Spain · Jan 2026 (ข้อสอบจริง)',
    paragraphs: [
      { role: 'intro', text: "It has been widely argued that while storing information on the internet rather than in books is both beneficial and detrimental to learning, this essay argues that the benefits are far greater than the drawbacks." },
      { role: 'body1', text: "To begin with, there are a number of benefits associated with storing information on the internet. The first benefit is that it allows instant access to knowledge from anywhere in the world. For example, students in remote areas of Kenya now use smartphones to access free online libraries that would otherwise be hours away by road. Another advantage is that online information can be updated constantly, keeping facts far more current than printed material. For instance, digital encyclopedias such as Wikipedia are revised within minutes of major world events, unlike printed reference books." },
      { role: 'body2', text: "However, some might be concerned regarding the unreliable and unverified nature of much online content. This is because anyone can publish information on the internet without any form of expert review. To illustrate, a 2020 Stanford University study found that most teenagers struggled to distinguish reliable news sources from misleading ones online. However, this argument is simply invalid given that reputable digital platforms now apply strict fact-checking and verification standards. For example, academic databases such as JSTOR only publish peer-reviewed material, offering the same reliability as traditional printed journals." },
      { role: 'conclusion', text: "In conclusion, although it is undeniable that some might be concerned in terms of the reliability of online information, I am of the opinion that the benefits of storing information on the internet, including instant access and constant updates, are far greater than the drawbacks." }
    ],
    vocab: [
      { word: 'instant access', thaiMeaning: 'การเข้าถึงได้ทันที' },
      { word: 'online libraries', thaiMeaning: 'ห้องสมุดออนไลน์' },
      { word: 'fact-checking', thaiMeaning: 'การตรวจสอบความถูกต้องของข้อมูล' },
      { word: 'peer-reviewed material', thaiMeaning: 'เอกสารที่ผ่านการตรวจสอบโดยผู้เชี่ยวชาญ' }
    ]
  },
  {
    id: 't2-ad-10',
    number: 10,
    typeId: 'advantages-disadvantages',
    title: 'Distance-Learning Programs',
    questionText:
      'Nowadays, distance-learning programs have gained popularity, allowing students to study online instead of attending college or university in person. Do the advantages of distance-learning programs outweigh the disadvantages?',
    meta: 'Australia · Jan 2026 (ข้อสอบจริง)',
    paragraphs: [
      { role: 'intro', text: "It has been widely argued that while distance-learning programs are both beneficial and detrimental to students compared with in-person study, this essay argues that the benefits are far greater than the drawbacks." },
      { role: 'body1', text: "To begin with, there are a number of benefits associated with distance-learning programs. The first benefit is that they allow students to study from any location without relocating for university. For example, the Open University in the United Kingdom enrols more than 130,000 students annually who study entirely online alongside full-time jobs. Another advantage is that online courses are typically far cheaper than traditional degrees, eliminating accommodation and campus costs altogether. For instance, several accredited online bachelor's degrees in the United States cost less than half the price of comparable on-campus programs, saving students thousands of dollars overall." },
      { role: 'body2', text: "However, some might be concerned regarding the lack of face-to-face interaction with instructors and classmates. This is because online students often miss out on spontaneous discussions and networking opportunities found on campus. To illustrate, a 2021 survey by Coursera found that nearly 40% of online learners reported feeling isolated during their studies. However, this argument is simply invalid given that modern platforms now offer live seminars and collaborative group projects. For example, universities such as Arizona State University run weekly video tutorials, allowing online students to interact directly with professors and peers." },
      { role: 'conclusion', text: "In conclusion, although it is undeniable that some might be concerned in terms of the lack of face-to-face interaction, I am of the opinion that the benefits of distance-learning programs, including flexibility and lower cost, are far greater than the drawbacks." }
    ],
    vocab: [
      { word: 'campus costs', thaiMeaning: 'ค่าใช้จ่ายในมหาวิทยาลัย' },
      { word: 'networking opportunities', thaiMeaning: 'โอกาสในการสร้างเครือข่าย' },
      { word: 'online learners', thaiMeaning: 'ผู้เรียนออนไลน์' },
      { word: 'video tutorials', thaiMeaning: 'วิดีโอสอนบทเรียน' }
    ]
  },
  {
    id: 't2-ad-11',
    number: 11,
    typeId: 'advantages-disadvantages',
    title: 'University Students Studying Abroad',
    questionText:
      'University students are increasingly studying abroad as part of their studies. Do the advantages of studying abroad outweigh the disadvantages?',
    meta: 'Uzbekistan · Jan 2026 (ข้อสอบจริง)',
    paragraphs: [
      { role: 'intro', text: "It has been widely argued that while university students studying abroad is both beneficial and detrimental to their academic careers, this essay argues that the benefits are far greater than the drawbacks." },
      { role: 'body1', text: "To begin with, there are a number of benefits associated with university students studying abroad. The first benefit is that it exposes students to different teaching methods and academic perspectives. For example, students who complete an Erasmus exchange programme in Europe report significantly stronger critical thinking skills upon returning to their home universities. Another advantage is that international study experience greatly improves future job prospects. For instance, a 2022 survey by the British Council found that 87% of employers preferred graduates with overseas study experience over those without any at all." },
      { role: 'body2', text: "However, some might be concerned regarding the high financial cost of studying overseas. This is because tuition fees, flights, and accommodation abroad often far exceed the cost of domestic study. To illustrate, international tuition fees at Australian universities can reach 45,000 dollars per year, excluding living expenses entirely. However, this argument is simply invalid given that numerous scholarships and grants are specifically designed to cover these costs. For example, the Chevening Scholarship programme fully funds tuition and living costs for hundreds of international students in the United Kingdom every single year." },
      { role: 'conclusion', text: "In conclusion, although it is undeniable that some might be concerned in terms of the financial cost of studying abroad, I am of the opinion that the benefits of university students studying abroad, including academic exposure and improved job prospects, are far greater than the drawbacks." }
    ],
    vocab: [
      { word: 'critical thinking skills', thaiMeaning: 'ทักษะการคิดวิเคราะห์' },
      { word: 'job prospects', thaiMeaning: 'โอกาสความก้าวหน้าในอาชีพ' },
      { word: 'tuition fees', thaiMeaning: 'ค่าเล่าเรียน' },
      { word: 'scholarships', thaiMeaning: 'ทุนการศึกษา' }
    ]
  },
  {
    id: 't2-ad-12',
    number: 12,
    typeId: 'advantages-disadvantages',
    title: 'Credit Cards for Young People',
    questionText:
      'Nowadays, it is easier for young people to have a credit card compared to the past. Do the advantages of this trend outweigh the disadvantages?',
    meta: 'แนวข้อสอบ (Prediction)',
    paragraphs: [
      { role: 'intro', text: "It has been widely argued that while young people having easier access to credit cards is both beneficial and detrimental to their financial wellbeing, this essay argues that the benefits are far greater than the drawbacks." },
      { role: 'body1', text: "To begin with, there are a number of benefits associated with young people having access to credit cards. The first benefit is that credit cards allow young people to build a strong credit history early in life. For example, banks in the United States report that customers who open a credit card by age 21 typically qualify for lower mortgage rates a decade later. Another advantage is that credit cards provide a convenient financial buffer during genuine emergencies. For instance, many students use credit cards to cover unexpected medical bills or urgent travel costs while studying overseas." },
      { role: 'body2', text: "However, some might be concerned regarding the risk of young people accumulating unmanageable debt. This is because many young cardholders lack experience in budgeting and may overspend on non-essential items. To illustrate, a 2022 report by the Federal Reserve found that credit card debt among under-25s in America had risen by nearly 15% in a single year. However, this argument is simply invalid given that most banks now require compulsory financial literacy modules before issuing cards to young applicants. For example, several major UK banks now offer built-in spending alerts, helping young customers track and control their spending closely." },
      { role: 'conclusion', text: "In conclusion, although it is undeniable that some might be concerned in terms of the risk of accumulating debt, I am of the opinion that the benefits of credit cards for young people, including building credit history and providing financial security, are far greater than the drawbacks." }
    ],
    vocab: [
      { word: 'credit history', thaiMeaning: 'ประวัติเครดิต' },
      { word: 'financial buffer', thaiMeaning: 'เงินสำรองทางการเงิน' },
      { word: 'budgeting', thaiMeaning: 'การทำงบประมาณ' },
      { word: 'spending alerts', thaiMeaning: 'การแจ้งเตือนการใช้จ่าย' }
    ]
  },
  {
    id: 't2-ad-13',
    number: 13,
    typeId: 'advantages-disadvantages',
    title: 'Shifting from Fossil Fuels to Alternative Energy',
    questionText:
      'Fossil fuels are the main source of energy around the world. However, people are encouraged to use alternative energy sources such as wind and solar energy. Do the advantages of this shift outweigh the disadvantages?',
    meta: 'UAE · Jan 2026 (ข้อสอบจริง)',
    paragraphs: [
      { role: 'intro', text: "It has been widely argued that while shifting from fossil fuels to alternative energy sources is both beneficial and detrimental to national economies, this essay argues that the benefits are far greater than the drawbacks." },
      { role: 'body1', text: "To begin with, there are a number of benefits associated with shifting to alternative energy sources. The first benefit is that renewable energy significantly reduces harmful carbon emissions that contribute to climate change. For example, Denmark now generates more than 50% of its electricity from wind power, cutting national carbon emissions dramatically since 2010. Another advantage is that renewable energy sources are increasingly cheaper to produce than fossil fuels. For instance, a 2021 report by the International Renewable Energy Agency found that solar power costs had fallen by 85% over the previous decade." },
      { role: 'body2', text: "However, some might be concerned regarding the unreliable and inconsistent supply of renewable energy. This is because solar and wind power depend heavily on weather conditions rather than constant availability. To illustrate, several European countries experienced electricity shortages in 2021 when unusually low winds reduced wind farm output. However, this argument is simply invalid given that modern battery storage technology can now store surplus renewable energy for later use. For example, Tesla's large-scale battery installation in South Australia has stored enough energy to power thousands of homes during periods of low wind generation." },
      { role: 'conclusion', text: "In conclusion, although it is undeniable that some might be concerned in terms of the inconsistent supply of renewable energy, I am of the opinion that the benefits of shifting to alternative energy, including reduced emissions and falling costs, are far greater than the drawbacks." }
    ],
    vocab: [
      { word: 'carbon emissions', thaiMeaning: 'การปล่อยก๊าซคาร์บอน' },
      { word: 'renewable energy', thaiMeaning: 'พลังงานหมุนเวียน' },
      { word: 'wind farm output', thaiMeaning: 'ผลผลิตพลังงานจากฟาร์มกังหันลม' },
      { word: 'battery storage', thaiMeaning: 'ระบบกักเก็บพลังงานด้วยแบตเตอรี่' }
    ]
  },
  {
    id: 't2-ad-14',
    number: 14,
    typeId: 'advantages-disadvantages',
    title: 'Artificial Intelligence Performing Human Tasks',
    questionText:
      'In many countries, people are now using artificial intelligence to perform tasks previously done by humans. Do the advantages of this trend outweigh the disadvantages?',
    meta: 'แนวข้อสอบ (Prediction)',
    paragraphs: [
      { role: 'intro', text: "It has been widely argued that while using artificial intelligence to perform tasks once done by humans is both beneficial and detrimental to the workforce, this essay argues that the benefits are far greater than the drawbacks." },
      { role: 'body1', text: "To begin with, there are a number of benefits associated with using artificial intelligence in the workplace. The first benefit is that AI can complete repetitive tasks far more quickly and accurately than humans. For example, Amazon's warehouse robots now process customer orders roughly four times faster than manual sorting teams did previously. Another advantage is that AI frees employees from tedious duties, allowing them to focus on more creative and strategic work. For instance, marketing teams at companies such as Coca-Cola now use AI tools to handle data analysis, leaving staff more time for campaign design." },
      { role: 'body2', text: "However, some might be concerned regarding the widespread job losses that automation may cause. This is because machines can increasingly replace roles in manufacturing, customer service, and even basic administration. To illustrate, a 2023 McKinsey report estimated that automation could displace up to 30% of current jobs worldwide by 2030. However, this argument is simply invalid given that new technologies typically create fresh employment opportunities in emerging industries. For example, the rise of AI has generated entirely new careers in data labelling and machine-learning engineering, roles that barely existed a decade ago." },
      { role: 'conclusion', text: "In conclusion, although it is undeniable that some might be concerned in terms of job losses caused by automation, I am of the opinion that the benefits of artificial intelligence in the workplace, including efficiency and new job creation, are far greater than the drawbacks." }
    ],
    vocab: [
      { word: 'repetitive tasks', thaiMeaning: 'งานที่ทำซ้ำๆ' },
      { word: 'data analysis', thaiMeaning: 'การวิเคราะห์ข้อมูล' },
      { word: 'job losses', thaiMeaning: 'การสูญเสียตำแหน่งงาน' },
      { word: 'machine-learning engineering', thaiMeaning: 'วิศวกรรมการเรียนรู้ของเครื่อง' }
    ]
  },
  {
    id: 't2-ad-15',
    number: 15,
    typeId: 'advantages-disadvantages',
    title: 'Robots in Society',
    questionText:
      'Some people believe that robots are very important for the future of human development, while others believe that they are dangerous and have a negative impact on society. Do the benefits of using robots in society outweigh the drawbacks?',
    meta: 'South Africa · Jan 2026 (ข้อสอบจริง)',
    paragraphs: [
      { role: 'intro', text: "It has been widely argued that while the growing use of robots in society is both beneficial and detrimental to human development, this essay argues that the benefits are far greater than the drawbacks." },
      { role: 'body1', text: "To begin with, there are a number of benefits associated with the growing use of robots in society. The first benefit is that robots can perform dangerous tasks that would otherwise put human workers at serious risk. For example, robots are now routinely used to defuse explosives and inspect damaged nuclear reactors, including at the Fukushima plant in Japan. Another advantage is that robots dramatically improve precision and efficiency in fields such as medicine. For instance, surgeons using robotic-assisted systems at Johns Hopkins Hospital have reported significantly fewer complications during complex operations in recent years." },
      { role: 'body2', text: "However, some might be concerned regarding the potential for robots to replace human workers and reduce social interaction. This is because increasing automation may leave many low-skilled workers permanently unemployed. To illustrate, several manufacturing towns in the American Midwest have experienced sharp job losses since factories introduced robotic assembly lines. However, this argument is simply invalid given that displaced workers can be retrained for newly created technical and supervisory roles. For example, Germany's government-funded retraining schemes have successfully transitioned thousands of former factory workers into robot maintenance and programming careers nationwide." },
      { role: 'conclusion', text: "In conclusion, although it is undeniable that some might be concerned in terms of job losses caused by robots, I am of the opinion that the benefits of using robots in society, including safety and improved precision, are far greater than the drawbacks." }
    ],
    vocab: [
      { word: 'nuclear reactors', thaiMeaning: 'เตาปฏิกรณ์นิวเคลียร์' },
      { word: 'robotic-assisted systems', thaiMeaning: 'ระบบที่ใช้หุ่นยนต์ช่วยปฏิบัติงาน' },
      { word: 'assembly lines', thaiMeaning: 'สายการประกอบชิ้นงาน' },
      { word: 'retraining schemes', thaiMeaning: 'โครงการฝึกอบรมทักษะใหม่' }
    ]
  },

  // ── Double Question ──────────────────────────────────────────────────
  {
    id: 't2-dq-1',
    number: 1,
    typeId: 'double-question',
    title: 'Living Longer, Fewer Babies',
    questionText:
      'In many countries, people are living longer and birth rates are falling. What problems does this cause? What measures could be taken to solve them?',
    meta: 'แนวข้อสอบ (Practice)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that increasing life expectancy, combined with falling birth rates, is placing considerable pressure on governments around the world. This essay will elaborate on the problems this trend causes before suggesting some measures to solve them."
      },
      {
        role: 'body1',
        text: "To begin with, there are a number of challenges associated with an ageing population. The first challenge is that healthcare systems face growing pressure as elderly citizens require more frequent medical treatment. For example, Japan, where more than 29% of the population is now over 65, has seen its national healthcare spending rise sharply over the past decade. Another challenge is that a shrinking workforce must support a growing number of retirees. For instance, countries such as Italy now have far fewer working-age taxpayers for every pensioner than they did in 1990."
      },
      {
        role: 'body2',
        text: "Turning to possible solutions, there are several measures that governments could adopt. The first is that raising the retirement age would allow older citizens to remain economically active for longer. For example, Germany has gradually raised its retirement age to 67 in order to ease pressure on its pension system. Another measure is that encouraging higher birth rates through financial incentives could help rebalance the population over time. For instance, France offers generous childcare subsidies, which have helped it maintain one of the highest birth rates in Europe."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that an ageing population creates serious challenges for governments, I am of the opinion that a combination of workforce reform and family support policies can help societies adapt successfully over the coming decades."
      }
    ],
    vocab: [
      { word: 'healthcare spending', thaiMeaning: 'ค่าใช้จ่ายด้านสุขภาพ' },
      { word: 'working-age taxpayers', thaiMeaning: 'ผู้เสียภาษีวัยทำงาน' },
      { word: 'childcare subsidies', thaiMeaning: 'เงินอุดหนุนค่าเลี้ยงดูเด็ก' },
      { word: 'birth rates', thaiMeaning: 'อัตราการเกิด' }
    ]
  },
  {
    id: 't2-dq-2',
    number: 2,
    typeId: 'double-question',
    title: 'Older People and Technology',
    questionText:
      'Some older people find it difficult to use modern technology such as smartphones and the Internet. What benefits could older people gain from using technology more? What could be done to encourage them to use it?',
    meta: 'แนวข้อสอบ (Practice)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while advanced technology has brought many beneficial changes to the world, many older people today struggle to make use of devices such as smartphones and the Internet. This essay will elaborate on the benefits older people could gain from using technology more before suggesting some measures to encourage them to do so."
      },
      {
        role: 'body1',
        text: "To begin with, there are a number of benefits older people could gain from advanced technology. The first benefit is that video-calling applications allow elderly people to stay in regular contact with family members who live far away. For example, many grandparents now use video calls to see their grandchildren grow up despite living in different countries. Another benefit is that health-monitoring devices can alert both elderly users and their doctors to medical problems at an early stage. For instance, wearable devices that track heart rate can warn users of irregular patterns before a serious health issue develops."
      },
      {
        role: 'body2',
        text: "Turning to possible measures, there are several ways older people could be encouraged to use consumer electronics more often. The first is that community centres could offer free, beginner-friendly technology classes designed specifically for older residents. For example, local libraries in several UK cities now run weekly digital skills workshops for elderly visitors. Another measure is that manufacturers could design devices with simpler interfaces and larger text specifically for older users. For instance, some smartphone models now include an \"easy mode\" that displays larger icons and fewer menu options."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that many older people currently struggle with modern technology, I am of the opinion that accessible training and better device design can help them enjoy its full benefits."
      }
    ],
    vocab: [
      { word: 'digital skills', thaiMeaning: 'ทักษะดิจิทัล' },
      { word: 'wearable devices', thaiMeaning: 'อุปกรณ์สวมใส่' },
      { word: 'simpler interfaces', thaiMeaning: 'หน้าจอใช้งานง่ายขึ้น' },
      { word: 'video-calling applications', thaiMeaning: 'แอปพลิเคชันวิดีโอคอล' }
    ]
  },
  {
    id: 't2-dq-3',
    number: 3,
    typeId: 'double-question',
    title: 'The Fresh Water Shortage',
    questionText:
      'Access to fresh water has become a problem in many parts of the world. What are the reasons for this? What measures could be taken to solve this problem?',
    meta: 'แนวข้อสอบ (Practice)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that access to fresh water has become a growing global problem in recent years. This essay will elaborate on the reasons for this before suggesting some solutions to tackle this issue."
      },
      {
        role: 'body1',
        text: "To begin with, there are a number of reasons why fresh water has become scarce in many regions. The first reason is that rising global temperatures are causing rivers, lakes, and glaciers to shrink at unprecedented rates. For example, the Colorado River in the United States now regularly runs dry before reaching the sea due to prolonged drought. Another reason is that rapid population growth has significantly increased overall water demand for agriculture and industry, particularly in rapidly urbanising regions. For instance, countries such as India now use groundwater faster than natural rainfall can replenish it."
      },
      {
        role: 'body2',
        text: "Turning to possible solutions, there are several measures that could help address this problem. The first is that governments could invest in modern irrigation systems that use significantly less water than traditional methods. For example, Israel has become a world leader in drip irrigation technology, cutting agricultural water use dramatically. Another measure is that individuals could reduce personal water waste through simple daily habits, such as taking shorter showers and fixing leaking taps. For instance, a single dripping tap can waste more than 20 litres of water every single day."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that fresh water scarcity is a complex global issue, I am of the opinion that a combination of government investment and individual responsibility can significantly ease this problem."
      }
    ],
    vocab: [
      { word: 'drip irrigation', thaiMeaning: 'การให้น้ำแบบหยด' },
      { word: 'groundwater', thaiMeaning: 'น้ำใต้ดิน' },
      { word: 'agricultural water use', thaiMeaning: 'การใช้น้ำเพื่อการเกษตร' },
      { word: 'prolonged drought', thaiMeaning: 'ภัยแล้งที่ยืดเยื้อ' }
    ]
  },
  {
    id: 't2-dq-4',
    number: 4,
    typeId: 'double-question',
    title: 'Why Drivers Break Road Safety Laws',
    questionText:
      'Although laws exist to make roads safer, many drivers still break them by speeding or using mobile phones. Why do drivers continue to break these laws? What measures could be taken to address this problem?',
    meta: 'แนวข้อสอบ (Practice)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that although driving laws exist in every country to ensure road safety, many drivers continue to break them by speeding or using mobile phones while driving. This essay will elaborate on the reasons behind this behaviour before suggesting some measures to tackle this issue."
      },
      {
        role: 'body1',
        text: "To begin with, there are a number of reasons why drivers continue to break road safety laws. The first reason is that many drivers underestimate the risks involved, believing that breaking minor rules will not lead to an accident. For example, surveys of drivers who use their phones at the wheel often reveal that most believe they can do so safely just this once. Another reason is that penalties for these offences are often too weak to act as an effective deterrent. For instance, fines for using a mobile phone while driving remain relatively low in several countries compared to the potential harm caused."
      },
      {
        role: 'body2',
        text: "Turning to possible solutions, there are several measures that could help solve this problem. The first is that governments could introduce stricter penalties, such as higher fines and automatic licence suspensions for repeat offenders. For example, some countries have successfully reduced phone-related accidents after introducing points-based licence systems. Another measure is that technology companies could design devices that automatically restrict phone use whenever a vehicle is moving. For instance, several smartphone models now include a driving mode that silences notifications once the car reaches a certain speed."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that changing driver behaviour takes time, I am of the opinion that stricter penalties combined with smarter technology can significantly improve road safety."
      }
    ],
    vocab: [
      { word: 'licence suspensions', thaiMeaning: 'การพักใช้ใบขับขี่' },
      { word: 'repeat offenders', thaiMeaning: 'ผู้กระทำผิดซ้ำ' },
      { word: 'points-based system', thaiMeaning: 'ระบบสะสมแต้ม' },
      { word: 'road safety', thaiMeaning: 'ความปลอดภัยบนท้องถนน' }
    ]
  },
  {
    id: 't2-dq-5',
    number: 5,
    typeId: 'double-question',
    title: 'Giving Children Everything They Want',
    questionText:
      'Some parents give their children everything they want and allow them complete freedom. Does this benefit children? What are the consequences when these children grow up?',
    meta: 'แนวข้อสอบ (Practice)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that some parents give their children everything they ask for or allow them complete freedom to do as they wish. This essay will elaborate on why this parenting style is not beneficial for children before discussing the consequences they may face once they grow up."
      },
      {
        role: 'body1',
        text: "To begin with, there are a number of reasons why this parenting style is not beneficial for children. The first reason is that children who receive everything they want rarely learn the value of patience or hard work. For example, children given expensive gifts without any effort attached often show little appreciation for what they receive. Another reason is that children allowed complete freedom rarely learn to respect boundaries or authority. For instance, teachers frequently report that children raised without firm rules at home struggle to follow classroom guidelines."
      },
      {
        role: 'body2',
        text: "Turning to the possible consequences, there are several ways this upbringing could affect these children later in life. The first is that they may struggle with discipline and responsibility once they enter the workplace. For example, employers often note that young employees who lacked structure as children find it harder to meet deadlines and follow instructions. Another consequence is that they may develop unrealistic expectations about how the wider world treats them. For instance, adults who were rarely told \"no\" as children often struggle to cope with rejection or failure later in life."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that parents want their children to be happy, I am of the opinion that giving children everything they want ultimately causes more harm than good."
      }
    ],
    vocab: [
      { word: 'firm rules', thaiMeaning: 'กฎเกณฑ์ที่เข้มงวด' },
      { word: 'unrealistic expectations', thaiMeaning: 'ความคาดหวังที่ไม่สมจริง' },
      { word: 'workplace responsibility', thaiMeaning: 'ความรับผิดชอบในที่ทำงาน' },
      { word: 'rejection or failure', thaiMeaning: 'การถูกปฏิเสธหรือความล้มเหลว' }
    ]
  },
  {
    id: 't2-dq-6',
    number: 6,
    typeId: 'double-question',
    title: 'The Rise of Personal Fitness Trainers',
    questionText:
      'In some countries, more and more people are hiring a personal fitness trainer, rather than playing sport or doing exercise classes. What are the reasons for this? Is this a positive or a negative development?',
    meta: 'Saudi Arabia · Feb 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that increasing numbers of people are now choosing to hire a personal fitness trainer instead of playing sport or attending exercise classes. This essay will elaborate on the reasons for this before discussing whether this is a positive or a negative development."
      },
      {
        role: 'body1',
        text: "To begin with, there are a number of reasons associated with the growing popularity of personal training. The first reason is that busy professionals often prefer a flexible schedule that fits around demanding work commitments. For example, a 2023 survey by the International Health, Racquet and Sportsclub Association found that over 60% of new gym members in the United States booked sessions with a trainer to save time. Another reason is that this is because many people lack the confidence to exercise correctly on their own. For instance, first-time gym users frequently report feeling intimidated by group classes filled with more experienced participants."
      },
      {
        role: 'body2',
        text: "With regard to my opinion, I would argue that this is a positive development. To explain it simply, this is because a qualified trainer can design a safe, personalised programme that reduces the risk of injury compared with unsupervised exercise. To illustrate, physiotherapy clinics in the UK have reported fewer gym-related injuries among clients who train under professional supervision. In this sense, it is evident that personal training offers genuine health benefits that extend well beyond simple convenience."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that hiring a personal trainer can be expensive for many households, I am of the opinion that the safety and motivation it provides make this a beneficial trend overall."
      }
    ],
    vocab: [
      { word: 'personal training', thaiMeaning: 'การฝึกส่วนตัว' },
      { word: 'flexible schedule', thaiMeaning: 'ตารางเวลาที่ยืดหยุ่น' },
      { word: 'personalised programme', thaiMeaning: 'โปรแกรมที่ออกแบบเฉพาะบุคคล' },
      { word: 'gym-related injuries', thaiMeaning: 'การบาดเจ็บที่เกี่ยวกับการออกกำลังกาย' }
    ]
  },
  {
    id: 't2-dq-7',
    number: 7,
    typeId: 'double-question',
    title: 'Money as a Gift',
    questionText:
      'In more and more countries, people choose to give money on special occasions rather than giving gifts chosen personally. Why might this be the case? Is it a positive or a negative development?',
    meta: 'India · Mar 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that more and more people now choose to give money on special occasions rather than gifts chosen personally. This essay will elaborate on the reasons for this before discussing whether this is a positive or a negative development."
      },
      {
        role: 'body1',
        text: "To begin with, there are a number of reasons associated with this shift towards monetary gifts. The first reason is that busy modern lifestyles leave people with very little free time to search for a suitable present. For example, a 2022 survey by Deloitte found that nearly half of consumers in the United States preferred giving cash during the holiday season because it required considerably less effort. Another reason is that this is because many givers worry about choosing something the recipient will not actually like or use. For instance, unwanted gifts are frequently returned to shops or left unused in cupboards for several years afterwards."
      },
      {
        role: 'body2',
        text: "With regard to my opinion, I would argue that this is a positive development. To explain it simply, money allows the recipient to choose exactly what they need or want, reducing unnecessary waste considerably. To illustrate, several charities in India have reported that unwanted physical gifts often end up discarded, whereas cash donations are rarely wasted in this way. In this sense, it is evident that monetary gifts can be a more practical and considerate choice than many people assume."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that a personally chosen gift can feel more thoughtful and meaningful, I am of the opinion that giving money instead is ultimately a sensible and welcome trend."
      }
    ],
    vocab: [
      { word: 'monetary gifts', thaiMeaning: 'ของขวัญที่เป็นเงิน' },
      { word: 'holiday season', thaiMeaning: 'ช่วงเทศกาลวันหยุด' },
      { word: 'unnecessary waste', thaiMeaning: 'ความสิ้นเปลืองที่ไม่จำเป็น' },
      { word: 'cash donations', thaiMeaning: 'การบริจาคเป็นเงินสด' }
    ]
  },
  {
    id: 't2-dq-8',
    number: 8,
    typeId: 'double-question',
    title: 'Declining Art Gallery Visitors',
    questionText:
      'In some countries, the number of people who visit art galleries is declining. What are the reasons for this? How can we solve this problem?',
    meta: 'India · Jan 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that the number of people visiting art galleries is declining in many countries. This essay will elaborate on the reasons for this before suggesting some solutions to tackle this issue."
      },
      {
        role: 'body1',
        text: "To begin with, there are a number of reasons associated with falling gallery attendance. The first reason is that free digital images of famous artworks are now widely available online, which reduces the need to visit a gallery in person. For example, the Google Arts and Culture platform allows users to view thousands of high-resolution paintings from major museums without leaving home. Another reason is that this is because many young people simply find traditional galleries unappealing compared with more interactive forms of entertainment. For instance, a 2021 study by the UK's Department for Digital, Culture, Media and Sport found that visitors under 25 made up the smallest share of gallery attendance."
      },
      {
        role: 'body2',
        text: "Turning to possible solutions, there are several measures that could help address this problem. The first is that galleries could introduce interactive exhibits, such as touchscreens and augmented reality displays, to attract younger visitors. For example, the Louvre in Paris now offers a virtual reality tour of the Mona Lisa that has drawn considerable public interest. Another measure is that galleries could reduce or waive entry fees for students, which would make visits more affordable and accessible. For instance, several major museums in New York already offer free admission on selected evenings each month."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that changing habits have drawn people away from traditional galleries, I am of the opinion that innovative exhibits and affordable pricing can help reverse this decline."
      }
    ],
    vocab: [
      { word: 'gallery attendance', thaiMeaning: 'จำนวนผู้เข้าชมหอศิลป์' },
      { word: 'digital images', thaiMeaning: 'ภาพดิจิทัล' },
      { word: 'interactive exhibits', thaiMeaning: 'นิทรรศการเชิงโต้ตอบ' },
      { word: 'entry fees', thaiMeaning: 'ค่าธรรมเนียมเข้าชม' }
    ]
  },
  {
    id: 't2-dq-9',
    number: 9,
    typeId: 'double-question',
    title: 'Valuing Celebrities Over Professionals',
    questionText:
      'In some societies, sports and entertainment figures are more valued than professionals such as doctors and teachers. Why is this the case? Do you consider it a positive or negative trend?',
    meta: 'India · Feb 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that sports and entertainment figures are often valued far more highly in society than professionals such as doctors and teachers. This essay will elaborate on the reasons for this before discussing whether this is a positive or a negative development."
      },
      {
        role: 'body1',
        text: "To begin with, there are a number of reasons associated with this imbalance in public recognition. The first reason is that mass media and social platforms give celebrities constant exposure, which keeps them firmly in the public eye at all times. For example, top footballers such as Cristiano Ronaldo have amassed hundreds of millions of followers on Instagram, far more than any doctor or teacher could realistically reach. Another reason is that this is because entertainment naturally generates strong emotional excitement that everyday professional work rarely produces. For instance, a single championship match can draw a global television audience of well over a billion viewers."
      },
      {
        role: 'body2',
        text: "With regard to my opinion, I would argue that this is a negative development. To explain it simply, this is because undervaluing essential professionals may discourage talented young people from pursuing genuinely vital careers such as medicine or teaching. To illustrate, a 2020 OECD report found that several member countries were struggling to fill teacher training places due to comparatively low salaries and social status. In this sense, it is evident that society's current priorities could ultimately weaken essential public services over time."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that entertainment provides genuine enjoyment and welcome inspiration, I am of the opinion that this imbalance in recognition is ultimately harmful to society as a whole."
      }
    ],
    vocab: [
      { word: 'public recognition', thaiMeaning: 'การยอมรับจากสังคม' },
      { word: 'mass media', thaiMeaning: 'สื่อมวลชน' },
      { word: 'social status', thaiMeaning: 'สถานะทางสังคม' },
      { word: 'public services', thaiMeaning: 'บริการสาธารณะ' }
    ]
  },
  {
    id: 't2-dq-10',
    number: 10,
    typeId: 'double-question',
    title: 'The Decline of Biodiversity',
    questionText:
      'In recent years, there has been a significant decline in the diversity of plant and animal species across numerous countries. What are the potential causes of this issue? How can we mitigate it?',
    meta: 'Oman · Feb 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that there has been a significant decline in the diversity of plant and animal species across numerous countries in recent years. This essay will elaborate on the potential causes of this issue before suggesting some measures to mitigate it."
      },
      {
        role: 'body1',
        text: "To begin with, there are a number of reasons associated with the loss of biodiversity worldwide. The first reason is that expanding agriculture and urban development are steadily destroying the natural habitats that countless species depend on. For example, the World Wildlife Fund reported in 2022 that global wildlife populations had fallen by an average of 69% since 1970, largely due to habitat loss. Another reason is that this is because rising global temperatures are altering ecosystems faster than many species can adapt. For instance, coral reefs in Australia's Great Barrier Reef have suffered repeated mass bleaching events linked directly to warming ocean waters."
      },
      {
        role: 'body2',
        text: "Turning to possible solutions, there are several measures that could help address this problem. The first is that governments could expand protected nature reserves, which would give threatened species a safer environment in which to recover. For example, Costa Rica has doubled its forest cover since the 1980s through a national programme of protected reserves. Another measure is that international agreements could restrict trade in endangered species and the products made from them. For instance, the Convention on International Trade in Endangered Species has helped reduce illegal ivory trafficking in several African nations."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that biodiversity loss stems from complex global pressures, I am of the opinion that stronger conservation policies can meaningfully slow this decline."
      }
    ],
    vocab: [
      { word: 'biodiversity loss', thaiMeaning: 'การสูญเสียความหลากหลายทางชีวภาพ' },
      { word: 'natural habitats', thaiMeaning: 'ถิ่นที่อยู่อาศัยตามธรรมชาติ' },
      { word: 'protected nature reserves', thaiMeaning: 'เขตอนุรักษ์ธรรมชาติ' },
      { word: 'endangered species', thaiMeaning: 'สัตว์ใกล้สูญพันธุ์' }
    ]
  },
  {
    id: 't2-dq-11',
    number: 11,
    typeId: 'double-question',
    title: 'Spending Money to Look Younger',
    questionText:
      "In today's world, people spend a lot of money on their appearance because they want to look younger. Why is this happening? Do you think this is a positive or negative development?",
    meta: 'New Zealand · Mar 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that people today spend a considerable amount of money on their appearance because they want to look younger. This essay will elaborate on the reasons for this before discussing whether this is a positive or a negative development."
      },
      {
        role: 'body1',
        text: "To begin with, there are a number of reasons associated with this growing focus on youthful appearance. The first reason is that social media platforms constantly expose users to filtered, flawless images, which creates strong pressure to match unrealistic beauty standards. For example, a 2019 study by the Royal Society for Public Health found that Instagram was closely linked to increased body image concerns among young adults. Another reason is that this is because many workplaces still associate a youthful appearance with energy and professional competence. For instance, several surveys of hiring managers have shown a subtle bias in favour of younger-looking candidates during job interviews."
      },
      {
        role: 'body2',
        text: "With regard to my opinion, I would argue that this is a negative development. To explain it simply, this is because excessive spending on cosmetic treatments can create unhealthy financial pressure and considerable anxiety about natural ageing. To illustrate, the global anti-ageing industry was valued at over 60 billion dollars in 2023, reflecting how deeply this pressure has spread worldwide. In this sense, it is evident that this obsession with appearance can distract people from more meaningful sources of self-worth."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that taking care of one's appearance can genuinely boost confidence, I am of the opinion that this widespread preoccupation with looking younger is ultimately unhealthy."
      }
    ],
    vocab: [
      { word: 'youthful appearance', thaiMeaning: 'รูปลักษณ์ที่ดูอ่อนเยาว์' },
      { word: 'body image', thaiMeaning: 'ภาพลักษณ์ของร่างกาย' },
      { word: 'cosmetic treatments', thaiMeaning: 'การรักษาด้านความงาม' },
      { word: 'natural ageing', thaiMeaning: 'การแก่ตัวตามธรรมชาติ' }
    ]
  },
  {
    id: 't2-dq-12',
    number: 12,
    typeId: 'double-question',
    title: 'Shopping as a Hobby',
    questionText:
      'Nowadays shopping has replaced many other activities that people choose as their hobby in their free time. What are the reasons for this? Is this a positive or negative development?',
    meta: 'UAE · Mar 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that shopping has replaced many other activities that people once chose as hobbies in their free time. This essay will elaborate on the reasons for this before discussing whether this is a positive or a negative development."
      },
      {
        role: 'body1',
        text: "To begin with, there are a number of reasons associated with the rise of shopping as a leisure activity. The first reason is that online retailers now make browsing and buying products effortless at any hour of the day. For example, Amazon reported that its mobile app usage in the United States increased by more than 30% between 2019 and 2023, reflecting this shift towards constant browsing. Another reason is that this is because shopping malls have transformed into entertainment destinations offering cinemas, restaurants, and events alongside stores. For instance, the Dubai Mall attracts millions of visitors each year who come primarily for entertainment rather than necessary purchases."
      },
      {
        role: 'body2',
        text: "With regard to my opinion, I would argue that this is a negative development. To explain it simply, treating shopping as a hobby encourages unnecessary consumption, placing growing strain on both personal finances and the environment. To illustrate, a 2021 report by the Ellen MacArthur Foundation found that fast fashion purchases driven by casual browsing were a major contributor to textile waste. In this sense, it is evident that this trend carries consequences well beyond simple personal enjoyment."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that shopping can provide genuine relaxation and social enjoyment, I am of the opinion that relying on it as a primary hobby is ultimately an unhealthy trend."
      }
    ],
    vocab: [
      { word: 'leisure activity', thaiMeaning: 'กิจกรรมยามว่าง' },
      { word: 'online retailers', thaiMeaning: 'ผู้ค้าปลีกออนไลน์' },
      { word: 'unnecessary consumption', thaiMeaning: 'การบริโภคที่ไม่จำเป็น' },
      { word: 'textile waste', thaiMeaning: 'ขยะสิ่งทอ' }
    ]
  },
  {
    id: 't2-dq-13',
    number: 13,
    typeId: 'double-question',
    title: 'The Problem of Youth Unemployment',
    questionText:
      'In many countries, more and more young people are dropping out of school but unable to find work. What problems do you think youth unemployment causes for individuals and society? What measures need to be taken to reduce youth unemployment?',
    meta: 'France · Mar 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that in many countries, growing numbers of young people are dropping out of school yet are still unable to find work. This essay will elaborate on the problems this trend causes before suggesting some measures to reduce youth unemployment."
      },
      {
        role: 'body1',
        text: "To begin with, there are a number of problems associated with rising youth unemployment. The first problem is that unemployed young people often experience declining mental health, as prolonged joblessness can damage self-esteem and future motivation. For example, a 2022 report by the International Labour Organization found that unemployed youth reported significantly higher rates of anxiety than their employed peers. Another problem is that this is because economies lose valuable productive potential when large numbers of young workers remain idle for extended periods. For instance, Spain's youth unemployment rate exceeded 30% in 2023, representing a substantial loss of national economic output."
      },
      {
        role: 'body2',
        text: "Turning to possible solutions, there are several measures that could help address this problem. The first is that governments could expand vocational training programmes that equip school leavers with practical, employable skills. For example, Germany's dual education system combines classroom study with paid apprenticeships, helping keep youth unemployment consistently low. Another measure is that companies could be offered tax incentives to hire and train inexperienced young workers. For instance, France introduced hiring subsidies in 2020 specifically aimed at encouraging businesses to employ workers under the age of 26."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that youth unemployment stems from complex economic pressures, I am of the opinion that vocational training and hiring incentives can significantly reduce this problem."
      }
    ],
    vocab: [
      { word: 'youth unemployment', thaiMeaning: 'การว่างงานของเยาวชน' },
      { word: 'mental health', thaiMeaning: 'สุขภาพจิต' },
      { word: 'vocational training', thaiMeaning: 'การฝึกอบรมสายอาชีพ' },
      { word: 'hiring subsidies', thaiMeaning: 'เงินอุดหนุนการจ้างงาน' }
    ]
  },
  {
    id: 't2-dq-14',
    number: 14,
    typeId: 'double-question',
    title: 'Traffic Congestion in Cities',
    questionText:
      'Traffic congestion in major cities has become considerably worse in recent years. What are the reasons for this? What solutions could be taken to tackle this issue?',
    meta: 'แนวข้อสอบ (Prediction)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that traffic congestion in major cities has become considerably worse in recent years. This essay will elaborate on the reasons for this before suggesting some solutions to tackle this issue."
      },
      {
        role: 'body1',
        text: "To begin with, there are a number of reasons associated with worsening urban traffic congestion. The first reason is that rapid population growth in cities has led to a sharp rise in the total number of vehicles on the road. For example, Bangkok's Office of Transport and Traffic Policy reported in 2022 that private car registrations had risen by nearly 15% over the previous five years. Another reason is that public transport systems in many cities remain limited or unreliable, pushing many commuters towards private vehicles instead. For instance, several rapidly growing cities in Southeast Asia still lack an extensive metro network capable of serving outer suburbs."
      },
      {
        role: 'body2',
        text: "Turning to possible solutions, there are several measures that could help address this problem. The first is that governments could invest heavily in expanding affordable and efficient public transport networks. For example, Singapore's continued investment in its Mass Rapid Transit system has helped keep private car ownership relatively low compared with neighbouring cities. Another measure is that authorities could introduce congestion charges for vehicles entering busy city centres during peak hours. For instance, London's congestion charge has been credited with reducing central traffic volumes since it was introduced in 2003."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that traffic congestion results from complex urban pressures, I am of the opinion that better public transport and congestion pricing can substantially ease this problem."
      }
    ],
    vocab: [
      { word: 'traffic congestion', thaiMeaning: 'การจราจรติดขัด' },
      { word: 'population growth', thaiMeaning: 'การเติบโตของประชากร' },
      { word: 'public transport networks', thaiMeaning: 'เครือข่ายขนส่งสาธารณะ' },
      { word: 'congestion charges', thaiMeaning: 'ค่าธรรมเนียมความแออัด' }
    ]
  },
  {
    id: 't2-dq-15',
    number: 15,
    typeId: 'double-question',
    title: 'Young People and Lack of Sleep',
    questionText:
      'Many young people today are getting considerably less sleep than previous generations. What are the reasons for this? What measures could be taken to solve this problem?',
    meta: 'แนวข้อสอบ (Prediction)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that many young people today are getting considerably less sleep than previous generations. This essay will elaborate on the reasons for this before suggesting some solutions to tackle this issue."
      },
      {
        role: 'body1',
        text: "To begin with, there are a number of reasons associated with declining sleep among young people. The first reason is that smartphones and social media keep teenagers engaged late into the night, which delays their natural bedtime. For example, a 2021 study by the Sleep Foundation found that teenagers who used their phones after 10pm slept, on average, over an hour less than those who did not. Another reason is that this is because heavy academic workloads and extracurricular commitments leave students with little time to rest before school assignments are due. For instance, students in several East Asian countries frequently report studying or completing homework past midnight."
      },
      {
        role: 'body2',
        text: "Turning to possible solutions, there are several measures that could help address this problem. The first is that schools could start lessons later in the morning to better match teenagers' natural sleep cycles. For example, several school districts in the United States delayed their start times after 2014 research from the American Academy of Pediatrics linked early starts to chronic sleep deprivation. Another measure is that parents could establish clear household rules limiting screen use during the hour before bedtime. For instance, some families now use automatic app timers that disable social media access each evening."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that modern lifestyles make sufficient sleep difficult to achieve, I am of the opinion that later school start times and screen limits can meaningfully improve this problem."
      }
    ],
    vocab: [
      { word: 'academic workloads', thaiMeaning: 'ภาระงานด้านการเรียน' },
      { word: 'sleep cycles', thaiMeaning: 'วงจรการนอนหลับ' },
      { word: 'screen use', thaiMeaning: 'การใช้หน้าจอ' },
      { word: 'sleep deprivation', thaiMeaning: 'การอดนอน' }
    ]
  }
]

export const getWritingTask2Prompts = (typeId: WritingTask2TypeId) =>
  WRITING_TASK2_PROMPTS.filter((prompt) => prompt.typeId === typeId)
